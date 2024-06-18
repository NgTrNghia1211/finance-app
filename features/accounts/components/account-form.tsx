import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { insertAccountSchema } from "@/db/schema";

import { Trash } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    console.log("NEW_ACCOUNT:", { values });

    onSubmit(values);
  };

  const handleDelete = () => {
    console.log("DELETE_ACCOUNT:", { id });

    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={disabled}
                    placeholder="e.g. Cash, Bank, Credit Card"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create account"}
        </Button>

        {!!id && (
          <Button
            className="w-full"
            disabled={disabled}
            type="button"
            size={"icon"}
            onClick={handleDelete}
            variant={"outline"}
          >
            <Trash className="size-4 mr-2" />
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  );
};
