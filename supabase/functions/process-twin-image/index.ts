
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { twinId } = await req.json();

    if (!twinId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: twinId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processing twin image for twin ID: ${twinId}`);

    // Get the twin data
    const { data: twin, error: twinError } = await supabase
      .from("digital_twins")
      .select("*")
      .eq("id", twinId)
      .single();

    if (twinError) {
      console.error("Error fetching twin:", twinError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch twin data" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!twin.image_url) {
      return new Response(
        JSON.stringify({ error: "Twin has no image to process" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update the twin status to processing
    const { error: updateError } = await supabase
      .from("digital_twins")
      .update({ processing_status: "processing" })
      .eq("id", twinId);

    if (updateError) {
      console.error("Error updating twin status:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update twin status" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create a processing job
    const { data: job, error: jobError } = await supabase
      .from("twin_processing_jobs")
      .insert([{ twin_id: twinId, status: "processing" }])
      .select()
      .single();

    if (jobError) {
      console.error("Error creating processing job:", jobError);
      return new Response(
        JSON.stringify({ error: "Failed to create processing job" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Simulate image processing (in a real app, this would call a ML service)
    // This is a placeholder for actual image processing logic
    const processImageAsync = async () => {
      try {
        console.log("Starting image processing...");
        
        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 5000));
        
        // Mock extracted features
        const features = {
          colors: ["#3A6EA5", "#FF6B6B", "#C0C0C0"],
          dimensions: { width: 800, height: 600 },
          detectedObjects: ["person", "chair", "desk"],
          confidence: 0.89,
          timestamp: new Date().toISOString(),
        };
        
        // Mock model data
        const modelData = {
          vertices: 1204,
          faces: 2048,
          textureResolution: "2048x2048",
          format: "glTF",
          renderingProperties: {
            materials: ["diffuse", "normal", "roughness"],
            shadingModel: "PBR",
            lightingModel: "IBL",
          },
        };
        
        // Update the twin with the processed data
        const { error: updateDataError } = await supabase
          .from("digital_twins")
          .update({
            processing_status: "completed",
            features,
            model_data: modelData,
          })
          .eq("id", twinId);
        
        if (updateDataError) {
          throw updateDataError;
        }
        
        // Update the job status
        const { error: updateJobError } = await supabase
          .from("twin_processing_jobs")
          .update({
            status: "completed",
            result: { features, modelData },
          })
          .eq("id", job.id);
        
        if (updateJobError) {
          throw updateJobError;
        }
        
        console.log("Image processing completed successfully");
      } catch (error) {
        console.error("Processing error:", error);
        
        // Update twin and job with error status
        await supabase
          .from("digital_twins")
          .update({
            processing_status: "error",
          })
          .eq("id", twinId);
        
        await supabase
          .from("twin_processing_jobs")
          .update({
            status: "error",
            error_message: error.message || "Unknown error during processing",
          })
          .eq("id", job.id);
      }
    };
    
    // Run the processing asynchronously - this allows the function to return immediately
    // while the processing continues in the background
    processImageAsync();
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Image processing started",
        job_id: job.id,
      }),
      {
        status: 202, // Accepted
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in process-twin-image function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
