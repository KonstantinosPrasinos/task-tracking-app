import { useMutation, useQueryClient } from "react-query";
import { useHandleDeleteGroups } from "@/hooks/delete-hooks/useHandleDeleteGroups";
import { useContext } from "react";
import { AlertsContext } from "@/context/AlertsContext.jsx";

const postChangeCategory = async (data) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACK_END_IP}/api/category/set`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error((await response.json()).message);
  }

  return response.json();
};

export function useChangeCategory() {
  const queryClient = useQueryClient();
  const { deleteGroups } = useHandleDeleteGroups();
  const alertsContext = useContext(AlertsContext);

  return useMutation({
    mutationFn: postChangeCategory,
    onSuccess: (data, requestObject) => {
      // For category
      if (data?.editedCategory) {
        queryClient.setQueryData(["categories"], (oldData) => {
          return {
            categories: [
              ...oldData.categories.filter(
                (category) => category._id !== data.editedCategory._id,
              ),
              {
                ...data.editedCategory,
              },
            ],
          };
        });
      }

      // For group deletion
      if (data?.affectedTasks) {
        deleteGroups(
          requestObject.groupsForDeletion,
          data.affectedTasks,
          requestObject.action,
        );
      }

      // For group editing
      if (data?.editedGroups && data.editedGroups.length > 0) {
        for (const group of data.editedGroups) {
          // Update affected tasks
          if (group.affectedTasks.length > 0) {
            queryClient.setQueryData(["tasks"], (oldDataTasks) => {
              return {
                tasks: [
                  ...oldDataTasks.tasks.map((task) => {
                    if (
                      group.affectedTasks.find(
                        (tempTaskId) => tempTaskId === task._id,
                      )
                    ) {
                      return {
                        ...task,
                        repeatRate: group.repeatRate,
                        longGoal: group.goal,
                      };
                    } else {
                      return task;
                    }
                  }),
                ],
              };
            });
          }

          // Delete affected tasks from object
          delete group.affectedTasks;
        }

        queryClient.setQueryData(["groups"], (oldData) => {
          return {
            groups: [
              ...oldData.groups.filter((group) => {
                return data.editedGroups.find(
                  (tempGroup) => tempGroup._id !== group._id,
                );
              }),
              ...data.editedGroups,
            ],
          };
        });
      }

      // For new groups
      if (data?.newGroups && data.newGroups.length > 0) {
        queryClient.setQueryData(["groups"], (oldData) => {
          return {
            groups: [...oldData.groups, ...data.newGroups],
          };
        });
      }
    },
    onError: (err) => {
      alertsContext.dispatch({
        type: "ADD_ALERT",
        payload: {
          type: "error",
          message: err.message,
          title: "Failed to edit category",
        },
      });
    },
  });
}
