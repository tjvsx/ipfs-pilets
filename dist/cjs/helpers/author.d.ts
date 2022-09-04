export interface Author {
    name: string;
    email: string;
}
export declare function formatAuthor(author: string | Partial<Author>, fallback?: string): Author;
