import { useState } from 'react'
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { XCircle } from 'lucide-react'

const RejectSubmissionDialog = () => {

    const [showRejectDialog, setShowRejectDialog] = useState(false)
    const handleRejectClick = () => setShowRejectDialog(true)
    const handleCloseClick = () => setShowRejectDialog(false)

    return (
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
            <DialogTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" >
                <XCircle className="w-4 h-4" />
                Reject Submission
            </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Reject Submission</DialogTitle>
                <DialogDescription>
                Rejecting this submission will reset the linked project task's submit status.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={handleCloseClick}>Cancel</Button>
                <Button onClick={handleRejectClick} variant="default">Reject</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export default RejectSubmissionDialog