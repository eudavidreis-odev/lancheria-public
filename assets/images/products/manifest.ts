// Manifesto de produtos de teste usando assets locais
// Para adicionar mais, importe o arquivo e inclua um item no array default export.

export type ProductSeed = {
    key: string; // usado como id do documento e nome do arquivo no Storage
    name: string;
    description: string;
    price: number; // em BRL
    asset: any; // require(module) do asset local
    filename: string; // nome do arquivo no Storage (ex.: hamburguer.jpg)
};

export const productsSeeds: ProductSeed[] = [
    {
        key: 'hamburguer',
        name: 'Hambúrguer Clássico',
        description: 'Pão macio, hambúrguer suculento, queijo derretido e molho da casa.',
        price: 24.9,
        asset: require('./hamburguer.jpg'),
        filename: 'hamburguer.jpg',
    },
    {
        key: 'hotdog',
        name: 'Hot Dog Especial',
        description: 'Salsicha, purê, batata palha, milho e molho especial.',
        price: 18.5,
        asset: require('./hotdog.jpg'),
        filename: 'hotdog.jpg',
    },
    {
        key: 'lanche_natural',
        name: 'Lanche Natural',
        description: 'Pão integral, frango, alface, tomate e maionese leve.',
        price: 19.9,
        asset: require('./lanche_natural.jpg'),
        filename: 'lanche_natural.jpg',
    },
    {
        key: 'refri_lata',
        name: 'Refrigerante Lata',
        description: 'Sua bebida geladinha na medida certa (lata 350ml).',
        price: 6.0,
        asset: require('./refri_lata.jpg'),
        filename: 'refri_lata.jpg',
    },
    {
        key: 'refri_2l',
        name: 'Refrigerante 2L',
        description: 'Perfeito para compartilhar (garrafa 2 litros).',
        price: 14.0,
        asset: require('./refri_2l.jpg'),
        filename: 'refri_2l.jpg',
    },
    {
        key: 'suco_natural',
        name: 'Suco Natural',
        description: 'Fruta fresca espremida na hora, sem conservantes.',
        price: 12.0,
        asset: require('./suco_natural.jpg'),
        filename: 'suco_natural.jpg',
    },
];

export default productsSeeds;
