import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { convertAmountToMiliunits } from "@/lib/utils";
import { insertTransactionSchema } from "@/db/schema";

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
import { Select } from "@/components/select/select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { MoneyInput } from "@/components/money-input";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  amount: z.string(),
  payee: z.string(),
  notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onCreateAccount?: (name: string) => void;
  onCreateCategory?: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Transaction Value: ", { values });

    const amount = parseFloat(values.amount);
    const amountinMiliunits = convertAmountToMiliunits(amount);

    onSubmit({
      ...values,
      amount: amountinMiliunits,
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <DatePicker
                    value={new Date()}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />

        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Account</FormLabel>
                <FormControl>
                  <Select
                    placeholder="Select an account"
                    options={accountOptions}
                    onCreate={onCreateAccount}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />

        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    placeholder="Select an account"
                    options={categoryOptions}
                    onCreate={onCreateCategory}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />

        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Payee</FormLabel>
                <FormControl>
                  <Input
                    disabled={disabled}
                    placeholder="Add a payee"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />

        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <MoneyInput
                    {...field}
                    disabled={disabled}
                    placeholder="0.00"
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />

        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    disabled={disabled}
                    placeholder="Optional notes"
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />

        {/* <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create transaction"}
        </Button> */}

        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create transaction"}
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
            Delete Transaction
          </Button>
        )}
      </form>
    </Form>
  );
};
