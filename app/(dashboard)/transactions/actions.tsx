"use client";

import React from "react";

import { useConfirm } from "@/hooks/use-confirm";
// import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
// import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";

import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";

type Props = {
  id: string;
};

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenTransaction();
  const deleteMutation = useDeleteTransaction(id);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction"
  );

  const handleDelete = async () => {
    console.log("Transaction id:", id);

    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={false}
            onClick={() => {
              onOpen(id);
            }}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
