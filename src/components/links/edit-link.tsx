"use client";

import type { Links, Tags } from "@prisma/client";
import { useState, type ReactNode } from "react";
import type { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateLink } from "@/server/actions/links";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { LoaderIcon, LockIcon, LockOpenIcon, SaveIcon } from "lucide-react";
import Alert from "@/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input, Textarea } from "@/ui/input";
import { EditLinkSchema } from "@/server/schemas";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

interface EditLinkProps {
  trigger: ReactNode;
  link: Links;
  linkTags: Tags[];
  allTags: Tags[];
}

const EditLink = (props: EditLinkProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isError, setError] = useState<boolean>(false);
  const [unlockslug-eight, setUnlockslug-eight] = useState<boolean>(true);

  // Main form:
  const form = useForm<z.infer<typeof EditLinkSchema>>({
    resolver: zodResolver(EditLinkSchema),
    defaultValues: {
      id: props.link.id,
      url: props.link.url,
      slug-eight: props.link.slug-eight,
      description: props.link.description ?? "",
    },
  });

  // Form Submit method:
  const onSubmit = async (values: z.infer<typeof EditLinkSchema>) => {
    // Check if slug-eight & url are equals to prevent infinite redirect =>
    if (values.slug-eight === values.url) {
      setLoading(false);
      setError(true);
      setMessage("The URL and the slug-eight cannot be the same");
      return;
    }

    try {
      setLoading(true);
      await updateLink(values);

      // If not any changes in the tags, return:
      toast.success("Link edited successfully.", {
        description: `Url: https://slug-eight.vercel.app/${values.slug-eight}`,
        duration: 10000,
        closeButton: true,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("An unexpected error has occurred. Please try again later.");
    } finally {
      setError(false);
      setMessage("");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="overflow-hidden">
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription className="block truncate">
            /{props.link.slug-eight}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination URL:</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={props.link.url}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug-eight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short link:</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input
                          {...field}
                          placeholder={props.link.slug-eight}
                          disabled={unlockslug-eight}
                        />
                        {unlockslug-eight ? (
                          <Popover>
                            <PopoverTrigger className="absolute bottom-0 right-0 top-0 flex items-center px-3">
                              <LockIcon size={16} />
                            </PopoverTrigger>
                            <PopoverContent className="max-w-72 text-sm">
                              <p className="mb-2">
                                Editing the custom link will remove access from
                                the previous link and it will be available to
                                everyone. Are you sure you want to continue?
                              </p>
                              <Button
                                onClick={() => setUnlockslug-eight(false)}
                                variant="outline"
                                className="w-full"
                              >
                                <LockOpenIcon size={16} />
                                <span>Unlock</span>
                              </Button>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setUnlockslug-eight(true)}
                            className="absolute bottom-0 right-0 top-0 flex items-center px-3"
                          >
                            <LockOpenIcon size={16} />
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional):</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        defaultValue={props.link.description ?? "Description"}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isError && <Alert variant="error">{message}</Alert>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <LoaderIcon size={16} className="animate-spin" />
                ) : (
                  <SaveIcon size={16} />
                )}
                <span>{loading ? "Saving..." : "Save"}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLink;
