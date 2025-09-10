
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, ScanLine } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/context/currency-context";
import { useUserData } from "@/context/user-data-context";
import { scanReceipt, ScanReceiptOutput } from "@/ai/flows/scan-receipt-flow";

const categories = ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Health", "Others"];

export function ReceiptScannerCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { formatCurrency } = useCurrency();
  const { addTransaction: addUserTransaction } = useUserData();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
        });
      }
    };
    getCameraPermission();
  }, [toast]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if(context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        return canvas.toDataURL('image/jpeg');
    }
    return null;
  };

  const handleScanReceipt = async () => {
    const photoDataUri = capturePhoto();
    if (!photoDataUri) {
      toast({ variant: "destructive", title: "Capture Failed", description: "Could not capture a photo." });
      return;
    }
    setIsLoading(true);

    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Scan Timed Out",
        description: "No receipt was detected within 5 seconds. Please try again.",
      });
    }, 5000);


    try {
      const result = await scanReceipt({ photoDataUri });
      clearTimeout(timeout);
      if (timedOut) return;

      if (result && result.category && result.amount && result.merchant) {
        const newTransaction = {
          merchant: result.merchant,
          amount: result.amount,
          category: categories.includes(result.category) ? result.category : "Others",
        };
        await addUserTransaction(newTransaction);
        toast({
          title: "Expense Scanned!",
          description: `${result.merchant} for ${formatCurrency(result.amount)} was added to ${newTransaction.category}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: "Could not extract details from the receipt. Please try again or add manually.",
        });
      }
    } catch (error: any) {
      clearTimeout(timeout);
      if (timedOut) return;
      console.error(error);
      toast({ variant: "destructive", title: "An Error Occurred", description: "Could not process the receipt." });
    } finally {
      if(!timedOut){
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="size-5 text-primary" />
          Scan Receipt
        </CardTitle>
        <CardDescription>
          Use your camera to scan a receipt and add an expense automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-md border bg-muted overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <Camera className="size-10 text-muted-foreground mb-4" />
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access to use this feature.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
             {hasCameraPermission === null && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
          </div>
          <Button onClick={handleScanReceipt} disabled={isLoading || !hasCameraPermission} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
            Scan and Add Expense
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
