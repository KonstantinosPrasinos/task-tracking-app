import {useMutation, useQueryClient} from "react-query";

const postDeleteCategory = async (data) => {
    const response = await fetch(`${import.meta.env.VITE_BACK_END_IP}/api/category/delete`, {
        method: 'POST',
        body: JSON.stringify({categoryId: data.categoryId, deleteTasks: data.deleteTasks}),
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Failed to delete task.')
    }

    return response.json();
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postDeleteCategory,
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ["tasks"]});
            await queryClient.invalidateQueries({queryKey: ["groups"]});
            queryClient.setQueryData(["categories"], (oldData) => {
                return oldData ? {
                    categories: [...oldData.categories.filter(category => category._id !== data.categoryId)]
                } : oldData
            })
        }
    })
}