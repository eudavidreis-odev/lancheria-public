/**
 * @packageDocumentation
 * Serviços para produtos: seed, assinatura em tempo real e consultas.
 * Integra-se ao Firebase Firestore quando disponível (Development Build).
 */
import productsSeeds from '@/assets/images/products/manifest';
import { getFirestore, isRNFirebaseAvailable, serverTimestamp } from '@/config/firebaseConfig';
import Constants from 'expo-constants';

/**
 * Estrutura de um produto publicado.
 */
export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    assetKey?: string; // chave local para mapear imagem do pacote
    imageBase64?: string; // imagem incorporada no Firestore
    imageMime?: string; // mime type da imagem incorporada
    category?: 'comida' | 'bebida';
    createdAt?: any;
};

/**
 * Resolve o MIME type a partir da extensão do arquivo.
 */
const contentTypeFrom = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'webp':
            return 'image/webp';
        default:
            return 'application/octet-stream';
    }
};

/**
 * Obtém URL de download do Storage com retentativas para contornar latências/propagação.
 * @param ref Referência do arquivo no Storage.
 * @param retries Número de tentativas.
 */
export const getUrlWithRetry = async (ref: any, retries = 5) => {
    let lastErr: any;
    for (let i = 0; i < retries; i++) {
        try {
            return await ref.getDownloadURL();
        } catch (e: any) {
            lastErr = e;
            const code = String(e?.code ?? '');
            if (code.includes('object-not-found') && i < retries - 1) {
                await new Promise((r) => setTimeout(r, 500 * (i + 1)));
                continue;
            }
            throw e;
        }
    }
    throw lastErr;
};

// Determina categoria por assetKey ou por nome
/**
 * Determina categoria do produto a partir do nome/asset.
 */
function determineCategory(name?: string, assetKey?: string): 'comida' | 'bebida' {
    const beverages = new Set(['refri_lata', 'refri_2l', 'suco_natural']);
    if (assetKey && beverages.has(assetKey)) return 'bebida';
    const n = (name ?? '').toLowerCase();
    if (n.includes('refri') || n.includes('refrigerante') || n.includes('suco') || n.includes('bebida')) return 'bebida';
    return 'comida';
}

// Upload desabilitado por requisição: vamos usar imagens locais
/**
 * Upload desabilitado: retorna caminho simbólico compatível sem efetuar upload real.
 */
export async function uploadAssetToStorage(_assetModule: any, filename: string): Promise<string> {
    // Retorna um caminho simbólico apenas para compat, mas não faz upload
    return `products/${filename}`;
}

/**
 * Insere produtos de teste no Firestore a partir do manifesto de assets locais.
 * Requer Development Build (não roda no Expo Go).
 */
export async function seedProductsFromAssets(): Promise<void> {
    if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') {
        throw new Error('Requer Development Build para gerar produtos.');
    }
    const db = (getFirestore() as any)();

    for (const item of productsSeeds) {
        // Usar IDs automáticos (pode gerar duplicados em re-seeds).
        await db.collection('products').add({
            name: item.name,
            description: item.description,
            price: item.price,
            assetKey: item.key, // referência local para a imagem
            category: determineCategory(item.name, item.key),
            createdAt: serverTimestamp(),
        });
    }
}

/**
 * Assina a coleção `products` no Firestore, ordenada por `createdAt` desc.
 * @returns Função para cancelar a assinatura.
 */
export function subscribeProducts(onChange: (products: Product[]) => void): () => void {
    if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') {
        onChange([]);
        return () => { };
    }
    const db = (getFirestore() as any)();
    const sub = db
        .collection('products')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snap: any) => {
            const list: Product[] = [];
            snap.forEach((doc: any) => {
                const d = doc.data() as any;
                list.push({
                    id: doc.id,
                    name: d.name,
                    description: d.description,
                    price: d.price,
                    assetKey: d.assetKey,
                    imageBase64: d.imageBase64,
                    imageMime: d.imageMime,
                    category: d.category,
                    createdAt: d.createdAt,
                });
            });
            onChange(list);
        });
    return () => sub();
}
// Busca um produto por ID
/**
 * Recupera um único produto pelo ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
    if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') return null;
    const db = (getFirestore() as any)();
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) return null;
    const d = doc.data() as any;
    return {
        id: doc.id,
        name: d.name,
        description: d.description,
        price: d.price,
        assetKey: d.assetKey,
        imageBase64: d.imageBase64,
        imageMime: d.imageMime,
        category: d.category,
        createdAt: d.createdAt,
    };
}
// Converte assets em Base64 e salva diretamente no Firestore por NOME do produto
// embedImagesBase64ForExistingProducts removida conforme solicitação

// Atualiza/define o campo category nos produtos existentes
/**
 * Atualiza a categoria de todos os produtos existentes a partir da heurística {@link determineCategory}.
 * @returns Quantidades de registros atualizados, ignorados e erros.
 */
export async function updateProductsCategory(): Promise<{ updated: number; skipped: number; errors: number }> {
    if (!isRNFirebaseAvailable() || Constants.appOwnership === 'expo') {
        throw new Error('Requer Development Build para atualizar categorias.');
    }
    const db = (getFirestore() as any)();
    const snap = await db.collection('products').get();
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    for (const doc of snap.docs) {
        try {
            const data = doc.data();
            const next = determineCategory(data?.name, data?.assetKey);
            if (data?.category === next) {
                skipped++;
                continue;
            }
            await doc.ref.update({ category: next });
            updated++;
        } catch (e: any) {
            console.error('[updateProductsCategory] erro ao atualizar', {
                productId: doc.id,
                errorCode: e?.code,
                message: e?.message ?? String(e),
            });
            errors++;
        }
    }
    return { updated, skipped, errors };
}
