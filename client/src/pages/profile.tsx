import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Upload, 
  User,
  CalendarRange,
  Car,
  MapPin
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/me"],
  });

  // Fetch user bookings
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ["/api/bookings"],
    enabled: !!user,
  });

  // Handle document upload
  const uploadDocument = useMutation({
    mutationFn: async () => {
      if (!selectedFile) return;
      // In a real app, we would upload the file to a server
      // Here we'll just update the document status
      await apiRequest("POST", "/api/user/document", {});
    },
    onSuccess: () => {
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully and is pending verification.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      setSelectedFile(null);
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadDocument.mutate();
    } else {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
    }
  };

  const getDocumentStatusBadge = () => {
    if (!user) return null;

    switch (user.documentStatus) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
      case "pending_verification":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending Verification</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not Uploaded</Badge>;
    }
  };

  if (isLoadingUser) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please log in to access your profile</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <AlertCircle className="h-16 w-16 text-primary mb-4" />
              <p className="text-center mb-6">
                You need to be logged in to view this page. Please log in or create an account.
              </p>
              <div className="flex gap-4">
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline">Register</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="profile" className="data-[state=active]:bg-white">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-white">
              <CalendarRange className="h-4 w-4 mr-2" />
              My Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal information and account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={user.username} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={user.fullName} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={user.phone || 'Not provided'} readOnly />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Edit Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Document Verification</span>
                  {getDocumentStatusBadge()}
                </CardTitle>
                <CardDescription>
                  Upload your identification documents for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    {user.documentStatus === "not_uploaded" && (
                      <>
                        <Upload className="h-12 w-12 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">Upload your ID</h3>
                        <p className="text-sm text-gray-500 text-center">
                          Drag and drop your identification document here or click the button below to browse files.
                          We accept passport, driving license, or national ID card.
                        </p>
                      </>
                    )}

                    {user.documentStatus === "pending_verification" && (
                      <>
                        <Clock className="h-12 w-12 text-yellow-500" />
                        <h3 className="text-lg font-medium text-gray-900">Verification in Progress</h3>
                        <p className="text-sm text-gray-500 text-center">
                          Your document has been submitted and is being reviewed by our team.
                          This usually takes 1-2 business days.
                        </p>
                      </>
                    )}

                    {user.documentStatus === "verified" && (
                      <>
                        <CheckCircle className="h-12 w-12 text-green-500" />
                        <h3 className="text-lg font-medium text-gray-900">Verified</h3>
                        <p className="text-sm text-gray-500 text-center">
                          Your document has been verified successfully.
                          You can now book any vehicle without restrictions.
                        </p>
                      </>
                    )}

                    {user.documentStatus === "rejected" && (
                      <>
                        <AlertCircle className="h-12 w-12 text-red-500" />
                        <h3 className="text-lg font-medium text-gray-900">Verification Failed</h3>
                        <p className="text-sm text-gray-500 text-center">
                          Your document verification has failed. Please upload a clear, valid document.
                          If you have any questions, please contact our support team.
                        </p>
                      </>
                    )}

                    {(user.documentStatus === "not_uploaded" || user.documentStatus === "rejected") && (
                      <div className="flex flex-col w-full items-center space-y-4">
                        <Input 
                          type="file" 
                          id="document" 
                          className="w-full max-w-xs" 
                          onChange={handleFileChange}
                          accept=".jpg,.jpeg,.png,.pdf"
                        />
                        <Button 
                          onClick={handleUpload}
                          disabled={!selectedFile || uploadDocument.isPending}
                        >
                          {uploadDocument.isPending ? "Uploading..." : "Upload Document"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Information</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Document verification is required for security purposes and to comply with our rental policies.
                          All your personal information is handled securely and in accordance with our privacy policy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View and manage your car rental bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingBookings ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-medium text-gray-900">Booking #{booking.id}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarRange className="h-4 w-4 mr-1" />
                              <span>
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Car className="h-4 w-4 mr-1" />
                              <span>Car ID: {booking.carId}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{booking.pickupLocation}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-start md:items-end gap-2">
                            <div className="text-primary font-bold">${booking.totalPrice}</div>
                            <Badge className={
                              booking.status === "confirmed" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                              booking.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                              booking.status === "cancelled" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                              "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      You haven't made any bookings yet. Browse our cars and book your first ride!
                    </p>
                    <Link href="/cars">
                      <Button className="mt-4">Browse Cars</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
