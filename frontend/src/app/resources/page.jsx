"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { PageWraper } from "../hoc";
import { resourcesAPI, isAuthenticated } from "../../services/api";

const RESOURCE_TYPES = [
  { value: 'ARTICLE', label: 'Article', icon: '📰' },
  { value: 'GUIDE', label: 'Guide', icon: '📖' },
  { value: 'VIDEO', label: 'Video', icon: '🎥' },
  { value: 'PDF', label: 'PDF Document', icon: '📄' },
  { value: 'INFOGRAPHIC', label: 'Infographic', icon: '📊' },
  { value: 'OTHER', label: 'Other', icon: '📎' },
];

const CATEGORIES = [
  { value: 'CROP_MANAGEMENT', label: 'Crop Management', icon: '🌾' },
  { value: 'PEST_CONTROL', label: 'Pest Control', icon: '🐛' },
  { value: 'IRRIGATION', label: 'Irrigation', icon: '💧' },
  { value: 'SOIL_HEALTH', label: 'Soil Health', icon: '🌱' },
  { value: 'WEATHER', label: 'Weather & Climate', icon: '🌤️' },
  { value: 'MARKET', label: 'Market Information', icon: '📈' },
  { value: 'TECHNOLOGY', label: 'Farm Technology', icon: '🚜' },
  { value: 'ORGANIC_FARMING', label: 'Organic Farming', icon: '🥬' },
  { value: 'LIVESTOCK', label: 'Livestock', icon: '🐄' },
  { value: 'GENERAL', label: 'General', icon: '📚' },
];

// Sample resources for when API is empty
const SAMPLE_RESOURCES = [
  {
    id: 'sample-1',
    title: 'Complete Guide to Crop Rotation',
    description: 'Learn how crop rotation can improve soil health and increase yields. This comprehensive guide covers different rotation patterns for various crops.',
    resource_type: 'GUIDE',
    category: 'CROP_MANAGEMENT',
    is_featured: true,
    views_count: 1245,
    external_url: 'https://www.agriculture.gov.in/crop-rotation',
    author: 'Ministry of Agriculture',
    tags: 'rotation,soil,health',
  },
  {
    id: 'sample-2',
    title: 'Integrated Pest Management Strategies',
    description: 'Discover sustainable pest management techniques that reduce chemical usage while protecting your crops.',
    resource_type: 'ARTICLE',
    category: 'PEST_CONTROL',
    is_featured: true,
    views_count: 892,
    author: 'Agricultural Research Institute',
    tags: 'pest,organic,sustainable',
  },
  {
    id: 'sample-3',
    title: 'Drip Irrigation Setup Tutorial',
    description: 'Step-by-step video guide on setting up efficient drip irrigation systems for maximum water conservation.',
    resource_type: 'VIDEO',
    category: 'IRRIGATION',
    is_featured: false,
    views_count: 2341,
    external_url: 'https://youtube.com/watch?v=example',
    author: 'Farm Tech Channel',
    tags: 'irrigation,water,drip',
  },
  {
    id: 'sample-4',
    title: 'Soil Testing: A Complete Guide',
    description: 'Understanding soil composition and how to test your soil for optimal crop growth.',
    resource_type: 'PDF',
    category: 'SOIL_HEALTH',
    is_featured: false,
    views_count: 567,
    author: 'Soil Science Department',
    tags: 'soil,testing,nutrients',
  },
  {
    id: 'sample-5',
    title: 'Weather Forecasting for Farmers',
    description: 'How to read weather patterns and use forecasting apps to plan farming activities.',
    resource_type: 'ARTICLE',
    category: 'WEATHER',
    is_featured: false,
    views_count: 789,
    author: 'Meteorological Department',
    tags: 'weather,planning,monsoon',
  },
  {
    id: 'sample-6',
    title: 'Market Price Trends 2026',
    description: 'Analysis of crop market prices and predictions for the coming season.',
    resource_type: 'INFOGRAPHIC',
    category: 'MARKET',
    is_featured: true,
    views_count: 1567,
    author: 'Agricultural Market Board',
    tags: 'market,prices,trends',
  },
];

const ResourceCard = ({ resource }) => {
  const typeInfo = RESOURCE_TYPES.find(t => t.value === resource.resource_type) || RESOURCE_TYPES[5];
  const categoryInfo = CATEGORIES.find(c => c.value === resource.category) || CATEGORIES[9];
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
      {/* Thumbnail/Header */}
      <div className={`p-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-100`}>
        <div className="flex justify-between items-start">
          <span className="text-3xl">{typeInfo.icon}</span>
          {resource.is_featured && (
            <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {categoryInfo.icon} {categoryInfo.label}
          </span>
        </div>
        
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {resource.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
          {resource.author && (
            <span className="flex items-center gap-1">
              ✍️ {resource.author}
            </span>
          )}
          <span className="flex items-center gap-1">
            👁️ {resource.views_count || 0} views
          </span>
        </div>
        
        {resource.external_url && (
          <Link 
            href={resource.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            View Resource →
          </Link>
        )}
      </div>
    </div>
  );
};

const ResourceLibrary = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await resourcesAPI.getAll();
      const fetchedResources = res.rows || [];
      // Use sample resources if API returns empty
      setResources(fetchedResources.length > 0 ? fetchedResources : SAMPLE_RESOURCES);
    } catch (err) {
      // Use sample resources on error
      setResources(SAMPLE_RESOURCES);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = filterCategory === 'ALL' || resource.category === filterCategory;
    const matchesType = filterType === 'ALL' || resource.resource_type === filterType;
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.tags && resource.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesType && matchesSearch;
  });

  const featuredResources = resources.filter(r => r.is_featured);

  return (
    <main className="form-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Resource Library</h1>
        <p className="text-gray-600">
          Access articles, guides, and resources to enhance your farming knowledge
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
        />
      </div>

      {/* Featured Resources */}
      {featuredResources.length > 0 && filterCategory === 'ALL' && filterType === 'ALL' && !searchQuery && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⭐ Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredResources.slice(0, 3).map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      )}

      {/* Category Filters */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Categories</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filterCategory === 'ALL'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category.value}
              onClick={() => setFilterCategory(category.value)}
              className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                filterCategory === category.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Resource Type</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filterType === 'ALL'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Types
          </button>
          {RESOURCE_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                filterType === type.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
      ) : filteredResources.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Resources Found</h3>
          <p className="text-gray-600">
            {searchQuery 
              ? 'Try a different search term'
              : 'No resources match your filters. Try adjusting the filters.'}
          </p>
        </div>
      )}
    </main>
  );
};

export default PageWraper(ResourceLibrary);
