import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PodDesign {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  is_public: boolean;
  sales_count: number;
  category: string;
  tags: string[];
  price_modifier: number;
  rejection_reason: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
    is_verified: boolean | null;
  };
}

export function usePublicDesigns(category?: string) {
  return useQuery({
    queryKey: ["pod-designs", "public", category],
    queryFn: async () => {
      let query = supabase
        .from("pod_designs")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            is_verified
          )
        `)
        .eq("is_public", true)
        .order("sales_count", { ascending: false });
      
      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as PodDesign[];
    },
  });
}

export function useMyDesigns() {
  return useQuery({
    queryKey: ["pod-designs", "my"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("pod_designs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as PodDesign[];
    },
  });
}

export function useFeaturedDesigns(limit = 6) {
  return useQuery({
    queryKey: ["pod-designs", "featured", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pod_designs")
        .select("*")
        .eq("status", "approved")
        .eq("is_public", true)
        .order("sales_count", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as unknown as PodDesign[];
    },
  });
}

export function useUploadDesign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      file,
      title,
      description,
      category,
      tags,
      isPublic,
    }: {
      file: File;
      title: string;
      description?: string;
      category: string;
      tags: string[];
      isPublic: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("pod-designs")
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("pod-designs")
        .getPublicUrl(fileName);
      
      // Create design record
      const { data, error } = await supabase
        .from("pod_designs")
        .insert({
          user_id: user.id,
          title,
          description,
          image_url: publicUrl,
          category,
          tags,
          is_public: isPublic,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pod-designs"] });
      toast.success("Design uploaded successfully!");
    },
    onError: (error) => {
      toast.error("Failed to upload design: " + error.message);
    },
  });
}

export function useDesignFavorites() {
  const queryClient = useQueryClient();
  
  const toggleFavorite = useMutation({
    mutationFn: async (designId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Check if already favorited
      const { data: existing } = await supabase
        .from("pod_design_favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("design_id", designId)
        .single();
      
      if (existing) {
        // Remove favorite
        const { error } = await supabase
          .from("pod_design_favorites")
          .delete()
          .eq("id", existing.id);
        if (error) throw error;
        return { action: "removed" };
      } else {
        // Add favorite
        const { error } = await supabase
          .from("pod_design_favorites")
          .insert({ user_id: user.id, design_id: designId });
        if (error) throw error;
        return { action: "added" };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["pod-design-favorites"] });
      toast.success(result.action === "added" ? "Added to favorites!" : "Removed from favorites");
    },
  });
  
  return { toggleFavorite };
}
