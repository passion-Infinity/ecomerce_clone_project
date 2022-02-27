export interface CategoryData {
    id: number;
    title: string;
}

export interface CategoriesResponseData {
    count: number;
    data: CategoryData[];
}