import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function WaveTerrainCustomizable() {
  const containerRef = useRef(null);
  const sceneRef = useRef({});
  
  // All customizable parameters
  const [params, setParams] = useState({
    // Camera
    cameraHeight: 8,
    cameraDistance: 12,
    cameraAngle: 0,
    fov: 60,
    
    // Terrain shape
    terrainWidth: 30,
    terrainDepth: 20,
    resolution: 150,
    
    // Wave animation
    waveSpeed: 0.5,
    waveAmplitude: 1.5,
    waveFrequencyX: 0.3,
    waveFrequencyZ: 0.4,
    waveComplexity: 4,
    waveType: 'standard',
    
    // Contour lines
    lineCount: 40,
    lineOpacity: 0.4,
    lineColor: '#ffffff',
    
    // Colors
    terrainColor: '#000000',
    backgroundColor: '#f5f5f3',
    
    // Mouse interaction
    mouseInfluence: 0,
    mouseRadius: 3,
  });

  const [showPanel, setShowPanel] = useState(true);
  const [activeTab, setActiveTab] = useState('camera');
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(params.backgroundColor);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(params.fov, width / height, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create terrain
    const geometry = new THREE.PlaneGeometry(
      params.terrainWidth, 
      params.terrainDepth, 
      params.resolution, 
      params.resolution
    );
    geometry.rotateX(-Math.PI / 2);

    const originalPositions = new Float32Array(geometry.attributes.position.array);

    const terrainMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(params.terrainColor),
      side: THREE.DoubleSide,
    });

    const terrain = new THREE.Mesh(geometry, terrainMaterial);
    terrain.position.y = -5;
    scene.add(terrain);

    // Create contour lines
    const lines = [];
    for (let i = 0; i < params.lineCount; i++) {
      const lineGeometry = new THREE.BufferGeometry();
      const points = [];
      const segments = params.resolution;
      
      for (let j = 0; j <= segments; j++) {
        points.push(new THREE.Vector3(
          (j / segments) * params.terrainWidth - params.terrainWidth / 2,
          0,
          (i / params.lineCount) * params.terrainDepth - params.terrainDepth / 2
        ));
      }
      
      lineGeometry.setFromPoints(points);
      
      const lineMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(params.lineColor),
        transparent: true,
        opacity: params.lineOpacity,
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      line.position.y = -4.98;
      lines.push(line);
      scene.add(line);
    }

    // Store refs for updates
    sceneRef.current = {
      scene,
      camera,
      renderer,
      terrain,
      geometry,
      originalPositions,
      lines,
      terrainMaterial,
    };

    // Mouse tracking
    const handleMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();
      const p = params;
      
      // Update camera position
      const angle = p.cameraAngle * Math.PI / 180;
      camera.position.set(
        Math.sin(angle) * p.cameraDistance,
        p.cameraHeight,
        Math.cos(angle) * p.cameraDistance
      );
      camera.lookAt(0, 0, 0);
      camera.fov = p.fov;
      camera.updateProjectionMatrix();

      // Animate terrain
      const positions = geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const z = originalPositions[i + 2];
        
        let height = 0;
        
        if (p.waveType === 'surf') {
          // Surf wave physics - creates breaking wave shape
          const wavePhase = x * p.waveFrequencyX + time * p.waveSpeed;
          
          // Main wave crest - sharp peak that curls
          const crest = Math.pow(Math.max(0, Math.sin(wavePhase)), 0.6) * p.waveAmplitude;
          
          // Wave curl - steeper front face
          const curl = Math.exp(-Math.pow(((wavePhase % (Math.PI * 2)) - Math.PI * 0.7), 2) * 2) * p.waveAmplitude * 0.8;
          
          // Traveling swell underneath
          const swell = Math.sin(z * p.waveFrequencyZ + time * p.waveSpeed * 0.5) * p.waveAmplitude * 0.3;
          
          // Secondary chop
          const chop = Math.sin(x * 0.5 + z * 0.3 + time * 2) * 0.3;
          const chop2 = Math.sin(x * 0.8 - z * 0.4 + time * 1.5) * 0.2;
          
          // Foam/texture at the crest
          const foam = Math.sin(x * 2 + time * 3) * Math.sin(z * 2 + time * 2) * 0.15;
          
          // Combine with depth falloff (waves get bigger as they approach "shore")
          const depthFactor = 1 + (z + p.terrainDepth / 2) / p.terrainDepth * 0.5;
          
          height = (crest + curl + swell) * depthFactor + chop + chop2 + foam;
          
          // Add breaking effect at peak
          if (crest > p.waveAmplitude * 0.8) {
            height += Math.sin(z * 3 + time * 5) * 0.3;
          }
        } else {
          // Standard rolling hills
          for (let w = 1; w <= p.waveComplexity; w++) {
            const freq = w * 0.15;
            const amp = p.waveAmplitude / w;
            const speed = p.waveSpeed * (1 + w * 0.2);
            
            height += Math.sin(x * p.waveFrequencyX * freq + time * speed) * amp;
            height += Math.sin(z * p.waveFrequencyZ * freq + time * speed * 0.8) * amp * 0.8;
          }
        }
        
        // Mouse influence
        if (p.mouseInfluence > 0) {
          const mx = mousePos.current.x * p.terrainWidth / 2;
          const mz = mousePos.current.y * p.terrainDepth / 2;
          const dist = Math.sqrt((x - mx) ** 2 + (z - mz) ** 2);
          if (dist < p.mouseRadius) {
            const influence = (1 - dist / p.mouseRadius) * p.mouseInfluence;
            height += Math.sin(dist * 2 - time * 3) * influence;
          }
        }
        
        positions[i + 1] = height;
      }
      
      geometry.attributes.position.needsUpdate = true;

      // Animate contour lines
      lines.forEach((line, lineIndex) => {
        const linePositions = line.geometry.attributes.position.array;
        const z = (lineIndex / lines.length) * p.terrainDepth - p.terrainDepth / 2;
        
        for (let i = 0; i < linePositions.length; i += 3) {
          const x = linePositions[i];
          
          let height = 0;
          
          if (p.waveType === 'surf') {
            const wavePhase = x * p.waveFrequencyX + time * p.waveSpeed;
            const crest = Math.pow(Math.max(0, Math.sin(wavePhase)), 0.6) * p.waveAmplitude;
            const curl = Math.exp(-Math.pow(((wavePhase % (Math.PI * 2)) - Math.PI * 0.7), 2) * 2) * p.waveAmplitude * 0.8;
            const swell = Math.sin(z * p.waveFrequencyZ + time * p.waveSpeed * 0.5) * p.waveAmplitude * 0.3;
            const chop = Math.sin(x * 0.5 + z * 0.3 + time * 2) * 0.3;
            const chop2 = Math.sin(x * 0.8 - z * 0.4 + time * 1.5) * 0.2;
            const foam = Math.sin(x * 2 + time * 3) * Math.sin(z * 2 + time * 2) * 0.15;
            const depthFactor = 1 + (z + p.terrainDepth / 2) / p.terrainDepth * 0.5;
            
            height = (crest + curl + swell) * depthFactor + chop + chop2 + foam;
          } else {
            for (let w = 1; w <= p.waveComplexity; w++) {
              const freq = w * 0.15;
              const amp = p.waveAmplitude / w;
              const speed = p.waveSpeed * (1 + w * 0.2);
              
              height += Math.sin(x * p.waveFrequencyX * freq + time * speed) * amp;
              height += Math.sin(z * p.waveFrequencyZ * freq + time * speed * 0.8) * amp * 0.8;
            }
          }
          
          if (p.mouseInfluence > 0) {
            const mx = mousePos.current.x * p.terrainWidth / 2;
            const mz = mousePos.current.y * p.terrainDepth / 2;
            const dist = Math.sqrt((x - mx) ** 2 + (z - mz) ** 2);
            if (dist < p.mouseRadius) {
              const influence = (1 - dist / p.mouseRadius) * p.mouseInfluence;
              height += Math.sin(dist * 2 - time * 3) * influence;
            }
          }
          
          linePositions[i + 1] = height + 0.05;
        }
        
        line.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [params]);

  // Update colors without full rebuild
  useEffect(() => {
    const { scene, terrainMaterial, lines } = sceneRef.current;
    if (scene) {
      scene.background = new THREE.Color(params.backgroundColor);
    }
    if (terrainMaterial) {
      terrainMaterial.color = new THREE.Color(params.terrainColor);
    }
    if (lines) {
      lines.forEach(line => {
        line.material.color = new THREE.Color(params.lineColor);
        line.material.opacity = params.lineOpacity;
      });
    }
  }, [params.backgroundColor, params.terrainColor, params.lineColor, params.lineOpacity]);

  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const Slider = ({ label, param, min, max, step = 0.1 }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-500 font-mono">{params[param]}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={params[param]}
        onChange={(e) => updateParam(param, parseFloat(e.target.value))}
        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  const ColorPicker = ({ label, param }) => (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-xs text-gray-300">{label}</span>
      <input
        type="color"
        value={params[param]}
        onChange={(e) => updateParam(param, e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
      />
    </div>
  );

  const tabs = [
    { id: 'camera', label: '📷 Camera' },
    { id: 'waves', label: '🌊 Waves' },
    { id: 'lines', label: '📏 Lines' },
    { id: 'colors', label: '🎨 Colors' },
    { id: 'mouse', label: '🖱️ Mouse' },
  ];

  const presets = {
    default: {
      cameraHeight: 8, cameraDistance: 12, cameraAngle: 0, fov: 60,
      waveSpeed: 0.5, waveAmplitude: 1.5, waveFrequencyX: 0.3, waveFrequencyZ: 0.4, waveComplexity: 4,
      lineCount: 40, lineOpacity: 0.4, lineColor: '#ffffff',
      terrainColor: '#000000', backgroundColor: '#f5f5f3',
      mouseInfluence: 0, mouseRadius: 3,
      waveType: 'standard',
    },
    surfWave: {
      cameraHeight: 3, cameraDistance: 18, cameraAngle: -75, fov: 70,
      waveSpeed: 1.2, waveAmplitude: 3.5, waveFrequencyX: 0.15, waveFrequencyZ: 0.6, waveComplexity: 5,
      lineCount: 60, lineOpacity: 0.7, lineColor: '#a8e6cf',
      terrainColor: '#0077b6', backgroundColor: '#caf0f8',
      mouseInfluence: 0, mouseRadius: 3,
      waveType: 'surf',
    },
    surfSunset: {
      cameraHeight: 2.5, cameraDistance: 20, cameraAngle: -80, fov: 65,
      waveSpeed: 1.0, waveAmplitude: 4, waveFrequencyX: 0.12, waveFrequencyZ: 0.5, waveComplexity: 6,
      lineCount: 50, lineOpacity: 0.6, lineColor: '#ffd166',
      terrainColor: '#1d3557', backgroundColor: '#ffb4a2',
      mouseInfluence: 0, mouseRadius: 3,
      waveType: 'surf',
    },
    pipeline: {
      cameraHeight: 1.5, cameraDistance: 14, cameraAngle: -90, fov: 85,
      waveSpeed: 1.5, waveAmplitude: 5, waveFrequencyX: 0.1, waveFrequencyZ: 0.8, waveComplexity: 7,
      lineCount: 70, lineOpacity: 0.8, lineColor: '#48cae4',
      terrainColor: '#023e8a', backgroundColor: '#90e0ef',
      mouseInfluence: 0, mouseRadius: 3,
      waveType: 'surf',
    },
    topDown: {
      cameraHeight: 20, cameraDistance: 1, cameraAngle: 0, fov: 50,
      waveAmplitude: 2, waveSpeed: 0.3,
      waveType: 'standard',
    },
    dramatic: {
      cameraHeight: 4, cameraDistance: 15, cameraAngle: 30, fov: 75,
      waveAmplitude: 2.5, waveComplexity: 6, waveSpeed: 0.8,
      waveType: 'standard',
    },
    calm: {
      waveSpeed: 0.2, waveAmplitude: 0.8, waveComplexity: 2,
      lineOpacity: 0.2,
      waveType: 'standard',
    },
    neon: {
      terrainColor: '#1a1a2e', backgroundColor: '#0f0f1a',
      lineColor: '#00ff88', lineOpacity: 0.8,
      waveType: 'standard',
    },
    sunset: {
      terrainColor: '#2d1b4e', backgroundColor: '#ffecd2',
      lineColor: '#ff6b6b', lineOpacity: 0.5,
      waveType: 'standard',
    },
    interactive: {
      mouseInfluence: 2, mouseRadius: 5,
      waveType: 'standard',
    },
  };

  const applyPreset = (presetName) => {
    setParams(prev => ({ ...prev, ...presets[presetName] }));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Toggle button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-4 right-4 z-20 bg-black/80 text-white px-3 py-2 rounded-lg text-sm hover:bg-black transition-colors"
      >
        {showPanel ? '✕ Hide' : '⚙️ Controls'}
      </button>

      {/* Control Panel */}
      {showPanel && (
        <div className="absolute top-4 left-4 z-20 w-72 bg-black/90 backdrop-blur-sm rounded-xl p-4 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Wave Terrain Controls</h2>
          
          {/* Presets */}
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">Quick Presets</div>
            <div className="flex flex-wrap gap-1">
              {Object.keys(presets).map(preset => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded transition-colors capitalize"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white text-black' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-1">
            {activeTab === 'camera' && (
              <>
                <Slider label="Height" param="cameraHeight" min={1} max={30} />
                <Slider label="Distance" param="cameraDistance" min={1} max={30} />
                <Slider label="Rotation °" param="cameraAngle" min={-180} max={180} step={1} />
                <Slider label="FOV" param="fov" min={20} max={120} step={1} />
              </>
            )}

            {activeTab === 'waves' && (
              <>
                <Slider label="Speed" param="waveSpeed" min={0} max={2} />
                <Slider label="Amplitude" param="waveAmplitude" min={0} max={5} />
                <Slider label="Frequency X" param="waveFrequencyX" min={0.1} max={1} />
                <Slider label="Frequency Z" param="waveFrequencyZ" min={0.1} max={1} />
                <Slider label="Complexity" param="waveComplexity" min={1} max={8} step={1} />
              </>
            )}

            {activeTab === 'lines' && (
              <>
                <Slider label="Line Count" param="lineCount" min={10} max={80} step={1} />
                <Slider label="Opacity" param="lineOpacity" min={0} max={1} />
                <ColorPicker label="Line Color" param="lineColor" />
              </>
            )}

            {activeTab === 'colors' && (
              <>
                <ColorPicker label="Terrain Color" param="terrainColor" />
                <ColorPicker label="Background" param="backgroundColor" />
              </>
            )}

            {activeTab === 'mouse' && (
              <>
                <Slider label="Influence" param="mouseInfluence" min={0} max={5} />
                <Slider label="Radius" param="mouseRadius" min={1} max={10} />
                <p className="text-xs text-gray-500 mt-2">
                  Move mouse over terrain to see ripple effect
                </p>
              </>
            )}
          </div>

          {/* Export */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <button
              onClick={() => {
                const json = JSON.stringify(params, null, 2);
                navigator.clipboard.writeText(json);
                alert('Parameters copied to clipboard!');
              }}
              className="w-full py-2 text-xs bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            >
              📋 Copy Config JSON
            </button>
          </div>
        </div>
      )}

      {/* Header overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h1 className="text-3xl md:text-4xl font-light text-gray-800" style={{ fontFamily: 'system-ui' }}>
          Interactive 3D Waves
        </h1>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
