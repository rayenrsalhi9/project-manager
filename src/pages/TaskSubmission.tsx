import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TaskSubmission = () => {

    return (
        <section className="min-h-[100dvh] flex items-center justify-center py-4 bg-gradient-to-br from-background to-muted/30">
            <div className="w-full max-w-2xl px-4">
                {/* Back Navigation */}
                <Link to='..' relative="path" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:gap-3 group mb-6">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-.5" />
                    <span className="text-sm font-medium">
                        Back to notification details
                    </span>
                </Link>

                {/* Main Task Submission Card */}
                <Card className="w-full border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                    <CardHeader className="py-4">
                        <CardTitle className="text-xl font-bold text-foreground">
                            Task Submission
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="bg-muted/50 rounded-lg p-6 text-center">
                            <div className="text-lg font-medium text-muted-foreground mb-2">
                                Task Submission Form
                            </div>
                            <p className="text-sm text-muted-foreground">
                                This is where users will be able to submit their completed tasks.
                                The form will include file upload, description, and other relevant fields.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                                <p className="text-sm text-primary font-medium">
                                    🚧 This feature is currently under development
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default TaskSubmission;