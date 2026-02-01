import { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Moon, Sun, Sparkles } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import FilterControls from './components/FilterControls';
import FilterPreviewGallery from './components/FilterPreviewGallery';
import FilteredImage from './components/FilteredImage';
import './App.css';

function App() {
  // State management for the entire app
  const [image, setImage] = useState(null); // Stores the uploaded image
  const [filters, setFilters] = useState({
    grayscale: false,
    sepia: false,
    invert: false,
    brightness: 100,
    contrast: 100,
  });
  const [showOriginal, setShowOriginal] = useState(false); // For before/after toggle
  const [theme, setTheme] = useState('dark'); // Theme toggle state
  const canvasRef = useRef(null); // Reference to canvas for image processing

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /**
   * Handles image upload
   * @param {File} file - The uploaded image file
   */
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      // Reset filters when new image is uploaded
      setFilters({
        grayscale: false,
        sepia: false,
        invert: false,
        brightness: 100,
        contrast: 100,
      });
    };
    reader.readAsDataURL(file);
  };

  /**
   * Updates filter values
   * @param {string} filterName - Name of the filter to update
   * @param {boolean|number} value - New value for the filter
   */
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  /**
   * Resets all filters to default values
   */
  const handleResetFilters = () => {
    setFilters({
      grayscale: false,
      sepia: false,
      invert: false,
      brightness: 100,
      contrast: 100,
    });
  };

  /**
   * Downloads the filtered image as PNG
   */
  const handleDownload = () => {
    if (!canvasRef.current || !image) return;

    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.download = `filtered-image-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  /**
   * Toggles between light and dark theme
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  /**
   * Applies a preset filter from the gallery
   * @param {Object} presetFilters - Filter configuration to apply
   */
  const handlePresetSelect = (presetFilters) => {
    setFilters(presetFilters);
  };

  return (
    <div className="app">
      {/* Header with title and theme toggle */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Sparkles className="logo-icon" />
            <h1>Photo Filter Studio</h1>
          </div>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="app-main">
        {!image ? (
          // Show image uploader when no image is loaded
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="editor-container">
            {/* Left sidebar with controls */}
            <aside className="controls-sidebar">
              <div className="controls-header">
                <h2>Filters & Effects</h2>
                <button 
                  className="btn-reset" 
                  onClick={handleResetFilters}
                  title="Reset all filters"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>

              {/* Filter controls component */}
              <FilterControls 
                filters={filters}
                onFilterChange={handleFilterChange}
              />

              {/* Action buttons */}
              <div className="action-buttons">
                <button 
                  className="btn-primary"
                  onClick={handleDownload}
                >
                  <Download size={18} />
                  Download Image
                </button>
                <label className="btn-secondary">
                  <Upload size={18} />
                  Upload New
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </aside>

            {/* Main image display area */}
            <div className="image-display">
              {/* Filtered image component with canvas */}
              <FilteredImage 
                image={image}
                filters={showOriginal ? {
                  grayscale: false,
                  sepia: false,
                  invert: false,
                  brightness: 100,
                  contrast: 100,
                } : filters}
                canvasRef={canvasRef}
              />

              {/* Before/After toggle button */}
              <button 
                className="compare-toggle"
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onMouseLeave={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
              >
                {showOriginal ? 'Original' : 'Hold to Compare'}
              </button>
            </div>

            {/* Filter preview gallery */}
            <aside className="preview-gallery">
              <h3>Quick Presets</h3>
              <FilterPreviewGallery 
                image={image}
                onPresetSelect={handlePresetSelect}
                currentFilters={filters}
              />
            </aside>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Built with React • Designed for Creators</p>
      </footer>
    </div>
  );
}

export default App;
