import { useState } from 'react'
import { supabase } from '@/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
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

const ApproveSubmissionDialog = ({submissionId, taskId}: {submissionId: number, taskId: number}) => {

    const [showApproveDialog, setShowApproveDialog] = useState(false)
    const navigate = useNavigate()

    const handleApproveClick = async() => {
        try {
            const {error} = await supabase.rpc('approve_submission', {
                submission_id_param: submissionId,
                task_id_param: taskId
            })
            if (error) {
                console.error('Error approving submission:', error)
                toast.error('Failed to approve submission');
                throw error;
            }
            toast.success('Submission approved successfully');
            navigate(`..`, {replace: true, relative: 'path'})
        } catch (error) {
            console.error('Error approving submission:', error)
            toast.error('Failed to approve submission');
        }
    } 

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