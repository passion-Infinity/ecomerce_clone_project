export interface ProductData {
    id: number;
    name: string;
    image: string;
    images?: string;
    description: string;
    price: number;
    quantity: number;
    short_desc?: string;
    category?: string;
}

export interface SeverResponseData {
    count: number;
    data: ProductData[];
}

export const emptyProduct = {
    id: 0,
    name: '',
    image: '',
    images: '',
    description: '',
    price: 0,
    quantity: 0,
    short_desc: '',
    category: '',
}
