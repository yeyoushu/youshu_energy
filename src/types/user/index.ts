interface menuItem {
    name: string;
    url: string;
    icon?: string;
    children?: menuItem[];
}
export type { menuItem };