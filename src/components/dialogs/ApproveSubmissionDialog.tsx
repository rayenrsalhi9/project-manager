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
import { CheckCircle } from 'lucide-react'

const ApproveSubmissionDialog = () => {

    const [showApproveDialog, setShowApproveDialog] = useState(false)
    const handleApproveClick = () => setShowApproveDialog(true)
    const handleCloseClick = () => setShowApproveDialog(false)

    return(
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
            <DialogTrigger asChild>
            <Button className="w-full flex items-center gap-2" >
                <CheckCircle className="w-4 h-4" />
                Approve Submission
            </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Approve Submission</DialogTitle>
                <DialogDescription>
                Are you sure you want to approve this submission? The associated project task will be marked as completed.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={handleCloseClick}>Cancel</Button>
                <Button onClick={handleApproveClick} variant="default">Approve</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export default ApproveSubmissionDialog