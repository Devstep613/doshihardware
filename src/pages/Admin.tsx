import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Product = Tables<'products'>;
type ProductInsert = TablesInsert<'products'>;
type ProductUpdate = TablesUpdate<'products'>;

type Testimonial = Tables<'testimonials'>;
type TestimonialInsert = TablesInsert<'testimonials'>;
type TestimonialUpdate = TablesUpdate<'testimonials'>;

type Comment = Tables<'comments'> & { products?: { name: string } };
type CommentInsert = TablesInsert<'comments'>;
type CommentUpdate = TablesUpdate<'comments'>;

type Inquiry = Tables<'inquiries'>;
type InquiryInsert = TablesInsert<'inquiries'>;
type InquiryUpdate = TablesUpdate<'inquiries'>;

// Product Form Component
const ProductForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  onClose,
  error,
}: {
  initialData?: Product;
  onSubmit: (data: ProductInsert | ProductUpdate) => void;
  isLoading?: boolean;
  onClose?: () => void;
  error?: string | null;
}) => {
  const [formData, setFormData] = useState<ProductInsert | ProductUpdate>({
    name: initialData?.name || "",
    category: initialData?.category || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    image_url: initialData?.image_url || "",
    is_featured: initialData?.is_featured || false,
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      category: initialData?.category || "",
      price: initialData?.price || 0,
      description: initialData?.description || "",
      image_url: initialData?.image_url || "",
      is_featured: initialData?.is_featured || false,
    });
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
      const base64File = await base64Promise;

      const { data, error } = await supabase.functions.invoke('upload-to-imagekit', {
        body: { 
          file: base64File,
          fileName: selectedFile.name 
        }
      });

      if (error) throw error;

      setFormData({ ...formData, image_url: data.url });
      toast.success("Image uploaded successfully!");
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Product" : "Add Product"}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="image">Product Image</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={handleImageUpload}
              disabled={!selectedFile || uploading}
              size="sm"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          {formData.image_url && (
            <div className="text-sm">
              <p className="text-muted-foreground">Current image:</p>
              <a 
                href={formData.image_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {formData.image_url}
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_featured"
          checked={formData.is_featured}
          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
        />
        <Label htmlFor="is_featured">Featured Product</Label>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={isLoading} aria-label={initialData ? "Update Product" : "Create Product"}>
        {isLoading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
};

// Testimonial Form Component
const TestimonialForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  onClose,
  error,
}: {
  initialData?: Testimonial;
  onSubmit: (data: TestimonialInsert | TestimonialUpdate) => void;
  isLoading?: boolean;
  onClose?: () => void;
  error?: string | null;
}) => {
  const [formData, setFormData] = useState<TestimonialInsert | TestimonialUpdate>({
    name: initialData?.name || "",
    message: initialData?.message || "",
    rating: initialData?.rating || 5,
  });

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      message: initialData?.message || "",
      rating: initialData?.rating || 5,
    });
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
      </DialogHeader>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="rating">Rating</Label>
        <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Star</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={isLoading} aria-label={initialData ? "Update Testimonial" : "Create Testimonial"}>
        {isLoading ? "Saving..." : initialData ? "Update Testimonial" : "Create Testimonial"}
      </Button>
    </form>
  );
};

// Comment Form Component
const CommentForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  onClose,
  error,
}: {
  initialData?: Comment;
  onSubmit: (data: CommentInsert | CommentUpdate) => void;
  isLoading?: boolean;
  onClose?: () => void;
  error?: string | null;
}) => {
  const [formData, setFormData] = useState<CommentInsert | CommentUpdate>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    message: initialData?.message || "",
    rating: initialData?.rating || 5,
    product_id: initialData?.product_id || null,
  });

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      email: initialData?.email || "",
      message: initialData?.message || "",
      rating: initialData?.rating || 5,
      product_id: initialData?.product_id || null,
    });
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Review" : "Add Review"}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="rating">Rating</Label>
        <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Star</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="product_id">Product ID</Label>
        <Input
          id="product_id"
          value={formData.product_id || ""}
          onChange={(e) => setFormData({ ...formData, product_id: e.target.value || null })}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={isLoading} aria-label={initialData ? "Update Review" : "Create Review"}>
        {isLoading ? "Saving..." : initialData ? "Update Review" : "Create Review"}
      </Button>
    </form>
  );
};

// Inquiry Form Component
const InquiryForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  onClose,
  error,
}: {
  initialData?: Inquiry;
  onSubmit: (data: InquiryInsert | InquiryUpdate) => void;
  isLoading?: boolean;
  onClose?: () => void;
  error?: string | null;
}) => {
  const [formData, setFormData] = useState<InquiryInsert | InquiryUpdate>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    message: initialData?.message || "",
  });

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      message: initialData?.message || "",
    });
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Inquiry" : "Add Inquiry"}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={isLoading} aria-label={initialData ? "Update Inquiry" : "Create Inquiry"}>
        {isLoading ? "Saving..." : initialData ? "Update Inquiry" : "Create Inquiry"}
      </Button>
    </form>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-8 text-center text-gray-500">{message}</div>
);

const Admin = () => {
  const queryClient = useQueryClient();

  const [editComment, setEditComment] = useState<Comment | undefined>(undefined);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [editInquiry, setEditInquiry] = useState<Inquiry | undefined>(undefined);
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);

  // Products
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Testimonials
  const { data: testimonials, isLoading: testimonialsLoading, error: testimonialsError } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Comments (Reviews)
  const { data: comments, isLoading: commentsLoading, error: commentsError } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*, products(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Inquiries
  const { data: inquiries, isLoading: inquiriesLoading, error: inquiriesError } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Dialog state for closing on submit
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>(undefined);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | undefined>(undefined);

  // Mutations
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const createProductMutation = useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase.from("products").insert([product]).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product created successfully");
      setProductDialogOpen(false);
      setProductFormError(null);
    },
    onError: (err: any) => setProductFormError(err?.message || "Failed to create product"),
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) => {
      const { data, error } = await supabase.from("products").update(updates).eq("id", id).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product updated successfully");
      setProductDialogOpen(false);
      setEditProduct(undefined);
      setProductFormError(null);
    },
    onError: (err: any) => setProductFormError(err?.message || "Failed to update product"),
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const [testimonialFormError, setTestimonialFormError] = useState<string | null>(null);
  const createTestimonialMutation = useMutation({
    mutationFn: async (testimonial: TestimonialInsert) => {
      const { data, error } = await supabase.from("testimonials").insert([testimonial]).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial created successfully");
      setTestimonialDialogOpen(false);
      setTestimonialFormError(null);
    },
    onError: (err: any) => setTestimonialFormError(err?.message || "Failed to create testimonial"),
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TestimonialUpdate }) => {
      const { data, error } = await supabase.from("testimonials").update(updates).eq("id", id).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial updated successfully");
      setTestimonialDialogOpen(false);
      setEditTestimonial(undefined);
      setTestimonialFormError(null);
    },
    onError: (err: any) => setTestimonialFormError(err?.message || "Failed to update testimonial"),
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      toast.success("Testimonial deleted successfully");
    },
    onError: () => toast.error("Failed to delete testimonial"),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      toast.success("Review deleted successfully");
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const [commentFormError, setCommentFormError] = useState<string | null>(null);
  const createCommentMutation = useMutation({
    mutationFn: async (comment: CommentInsert) => {
      const { data, error } = await supabase.from("comments").insert([comment]).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      toast.success("Review created successfully");
      setCommentDialogOpen(false);
      setCommentFormError(null);
    },
    onError: (err: any) => setCommentFormError(err?.message || "Failed to create review"),
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: CommentUpdate }) => {
      const { data, error } = await supabase.from("comments").update(updates).eq("id", id).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      toast.success("Review updated successfully");
      setCommentDialogOpen(false);
      setEditComment(undefined);
      setCommentFormError(null);
    },
    onError: (err: any) => setCommentFormError(err?.message || "Failed to update review"),
  });

  const deleteInquiryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      toast.success("Inquiry deleted successfully");
    },
    onError: () => toast.error("Failed to delete inquiry"),
  });

  const [inquiryFormError, setInquiryFormError] = useState<string | null>(null);
  const createInquiryMutation = useMutation({
    mutationFn: async (inquiry: InquiryInsert) => {
      const { data, error } = await supabase.from("inquiries").insert([inquiry]).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      toast.success("Inquiry created successfully");
      setInquiryDialogOpen(false);
      setInquiryFormError(null);
    },
    onError: (err: any) => setInquiryFormError(err?.message || "Failed to create inquiry"),
  });

  const updateInquiryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: InquiryUpdate }) => {
      const { data, error } = await supabase.from("inquiries").update(updates).eq("id", id).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      toast.success("Inquiry updated successfully");
      setInquiryDialogOpen(false);
      setEditInquiry(undefined);
      setInquiryFormError(null);
    },
    onError: (err: any) => setInquiryFormError(err?.message || "Failed to update inquiry"),
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        aria-label={i < rating ? "Filled star" : "Empty star"}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Products Management</CardTitle>
              <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button aria-label="Add Product" onClick={() => { setEditProduct(undefined); setProductFormError(null); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <ProductForm
                    onSubmit={(data) => createProductMutation.mutate(data as ProductInsert)}
                    isLoading={createProductMutation.isPending}
                    error={productFormError}
                    onClose={() => setProductDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : productsError ? (
                <EmptyState message="Failed to load products." />
              ) : !products || products.length === 0 ? (
                <EmptyState message="No products found." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>KSh {product.price}</TableCell>
                        <TableCell>
                          <Badge variant={product.is_featured ? "default" : "secondary"}>
                            {product.is_featured ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog
                              open={editProduct?.id === product.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setEditProduct(product);
                                  setProductFormError(null);
                                } else {
                                  setEditProduct(undefined);
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" aria-label="Edit Product">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <ProductForm
                                  initialData={product}
                                  onSubmit={(data) =>
                                    updateProductMutation.mutate({ id: product.id, updates: data as ProductUpdate })
                                  }
                                  isLoading={updateProductMutation.isPending}
                                  error={productFormError}
                                  onClose={() => setEditProduct(undefined)}
                                />
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" aria-label="Delete Product">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteProductMutation.mutate(product.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Testimonials Management</CardTitle>
              <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
                <DialogTrigger asChild>
                  <Button aria-label="Add Testimonial" onClick={() => { setEditTestimonial(undefined); setTestimonialFormError(null); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <TestimonialForm
                    onSubmit={(data) => createTestimonialMutation.mutate(data as TestimonialInsert)}
                    isLoading={createTestimonialMutation.isPending}
                    error={testimonialFormError}
                    onClose={() => setTestimonialDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {testimonialsLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : testimonialsError ? (
                <EmptyState message="Failed to load testimonials." />
              ) : !testimonials || testimonials.length === 0 ? (
                <EmptyState message="No testimonials found." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell>{testimonial.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{testimonial.message}</TableCell>
                        <TableCell>
                          <div className="flex">{renderStars(testimonial.rating)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog
                              open={editTestimonial?.id === testimonial.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setEditTestimonial(testimonial);
                                  setTestimonialFormError(null);
                                } else {
                                  setEditTestimonial(undefined);
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" aria-label="Edit Testimonial">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <TestimonialForm
                                  initialData={testimonial}
                                  onSubmit={(data) =>
                                    updateTestimonialMutation.mutate({ id: testimonial.id, updates: data })
                                  }
                                  isLoading={updateTestimonialMutation.isPending}
                                  error={testimonialFormError}
                                  onClose={() => setEditTestimonial(undefined)}
                                />
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" aria-label="Delete Testimonial">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete testimonial from "{testimonial.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteTestimonialMutation.mutate(testimonial.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reviews Management</CardTitle>
              <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
                <DialogTrigger asChild>
                  <Button aria-label="Add Review" onClick={() => { setEditComment(undefined); setCommentFormError(null); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CommentForm
                    onSubmit={(data) => createCommentMutation.mutate(data as CommentInsert)}
                    isLoading={createCommentMutation.isPending}
                    error={commentFormError}
                    onClose={() => setCommentDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {commentsLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : commentsError ? (
                <EmptyState message="Failed to load reviews." />
              ) : !comments || comments.length === 0 ? (
                <EmptyState message="No reviews found." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments.map((comment) => (
                      <TableRow key={comment.id} className={comment.rating <= 2 ? "bg-red-50" : ""}>
                        <TableCell>{comment.name}</TableCell>
                        <TableCell>{comment.email}</TableCell>
                        <TableCell>{comment.products?.name || "General"}</TableCell>
                        <TableCell className="max-w-xs truncate">{comment.message}</TableCell>
                        <TableCell>
                          <div className="flex">{renderStars(comment.rating)}</div>
                        </TableCell>
                        <TableCell>{formatDate(comment.created_at || "")}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog
                              open={editComment?.id === comment.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setEditComment(comment);
                                  setCommentFormError(null);
                                } else {
                                  setEditComment(undefined);
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" aria-label="Edit Review">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <CommentForm
                                  initialData={comment}
                                  onSubmit={(data) =>
                                    updateCommentMutation.mutate({ id: comment.id, updates: data as CommentUpdate })
                                  }
                                  isLoading={updateCommentMutation.isPending}
                                  error={commentFormError}
                                  onClose={() => setEditComment(undefined)}
                                />
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" aria-label="Delete Review">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Review</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this review from "{comment.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteCommentMutation.mutate(comment.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inquiries Tab */}
        <TabsContent value="inquiries">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Inquiries Management</CardTitle>
              <Dialog open={inquiryDialogOpen} onOpenChange={setInquiryDialogOpen}>
                <DialogTrigger asChild>
                  <Button aria-label="Add Inquiry" onClick={() => { setEditInquiry(undefined); setInquiryFormError(null); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Inquiry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <InquiryForm
                    onSubmit={(data) => createInquiryMutation.mutate(data as InquiryInsert)}
                    isLoading={createInquiryMutation.isPending}
                    error={inquiryFormError}
                    onClose={() => setInquiryDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {inquiriesLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : inquiriesError ? (
                <EmptyState message="Failed to load inquiries." />
              ) : !inquiries || inquiries.length === 0 ? (
                <EmptyState message="No inquiries found." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell>{inquiry.name}</TableCell>
                        <TableCell>{inquiry.email}</TableCell>
                        <TableCell>{inquiry.phone || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                        <TableCell>{formatDate(inquiry.created_at || "")}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog
                              open={editInquiry?.id === inquiry.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setEditInquiry(inquiry);
                                  setInquiryFormError(null);
                                } else {
                                  setEditInquiry(undefined);
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" aria-label="Edit Inquiry">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <InquiryForm
                                  initialData={inquiry}
                                  onSubmit={(data) =>
                                    updateInquiryMutation.mutate({ id: inquiry.id, updates: data as InquiryUpdate })
                                  }
                                  isLoading={updateInquiryMutation.isPending}
                                  error={inquiryFormError}
                                  onClose={() => setEditInquiry(undefined)}
                                />
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" aria-label="Delete Inquiry">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this inquiry from "{inquiry.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteInquiryMutation.mutate(inquiry.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
