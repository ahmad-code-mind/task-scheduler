export const PaginationStatesMixin = {
    data() {
        return {
            selectedPageSize: 20,
            currentPage: 1,
            customPageSizeOptions: [
                { value: 20, label: '20' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
            ],
        };
    },
};