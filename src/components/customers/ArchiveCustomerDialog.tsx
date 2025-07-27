import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ArchiveCustomerDialogProps = {
  customerId: number;
  onArchive: (id: number) => void;
};

// Dialog to confirm archiving a customer
export default function ArchiveCustomerDialog({
  customerId,
  onArchive,
}: ArchiveCustomerDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-red-700 text-white hover:bg-red-800"
        >
          Archive
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Archive Customer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to archive this customer? It will be removed
            from the active list but still accessible from the archived section.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-100 border border-gray-300 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onArchive(customerId)}
            className="bg-red-700 text-white hover:bg-red-800"
          >
            Confirm Archive
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
