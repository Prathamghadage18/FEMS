"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { PageWraper } from "../../hoc";
import { plotsAPI, cropPlanningAPI, isAuthenticated } from "../../../services/api";
import "leaflet/dist/leaflet.css";

// Dynamically import map component to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

const PlotsMap = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plots, setPlots] = useState([]);
  const [cropPlans, setCropPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/signin");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch plots and crop planning data
      const [plotsResponse, cropPlansResponse] = await Promise.all([
        plotsAPI.getAll(),
        cropPlanningAPI.getAll(),
      ]);

      const plotsData = plotsResponse.rows || [];
      const cropPlansData = cropPlansResponse.rows || [];

      // Filter plots that have valid coordinates
      const validPlots = plotsData.filter(
        (plot) =>
          plot.latitude &&
          plot.longitude &&
          !isNaN(parseFloat(plot.latitude)) &&
          !isNaN(parseFloat(plot.longitude))
      );

      if (validPlots.length === 0) {
        setError("No plots with valid coordinates found. Please add coordinates to your plots.");
      }

      setPlots(validPlots);
      setCropPlans(cropPlansData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load plots data");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get crop assigned to a plot
  const getCropForPlot = (plotId) => {
    const cropPlan = cropPlans.find((cp) => cp.plot === plotId);
    return cropPlan?.crop_name || "No crop assigned";
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Farm Plots Map</h1>
          <p className="text-gray-600">
            View all your farm plots on an interactive map with live weather data
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && plots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Plots</p>
                  <p className="text-3xl font-bold text-gray-800">{plots.length}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Area</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {plots.reduce((sum, plot) => sum + (parseFloat(plot.area) || 0), 0).toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-xs">acres</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Crops Planted</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {cropPlans.filter((cp) => plots.some((p) => p.id === cp.plot)).length}
                  </p>
                </div>
                <div className="bg-amber-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading plots data...</p>
            </div>
          </div>
        ) : plots.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <MapView plots={plots} getCropForPlot={getCropForPlot} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="text-center">
              <svg
                className="w-20 h-20 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Plots Found</h3>
              <p className="text-gray-600 mb-6">
                You haven't added any plots with coordinates yet.
              </p>
              <button
                onClick={() => router.push("/plots")}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Add Your First Plot
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PageWraper(PlotsMap);
