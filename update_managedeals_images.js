const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'client', 'ManageDeals.jsx');

let content = fs.readFileSync(filePath, 'utf8');

// 1. Update updateStorage mapping
content = content.replace(
    'storeImg: p.storeImg',
    'storeImg: p.storeImg,\n                images: p.images || [p.image]'
);

// 2. Add handlers for gallery images before `return (`
const handlersCode = `
    const handleGalleryImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const currentImages = currentProduct.images || [currentProduct.image];
            const maxAllowed = 5 - currentImages.length;
            const filesToProcess = files.slice(0, maxAllowed);
            
            if (filesToProcess.length === 0) {
                alert('Maximum 5 images allowed.');
                return;
            }

            Promise.all(filesToProcess.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            let { width, height } = img;
                            const maxDim = 800;
                            if (width > height && width > maxDim) {
                                height = Math.round((height * maxDim) / width);
                                width = maxDim;
                            } else if (height > maxDim) {
                                width = Math.round((width * maxDim) / height);
                                height = maxDim;
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);
                            resolve(canvas.toDataURL('image/jpeg', 0.6));
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                });
            })).then(results => {
                setCurrentProduct({
                    ...currentProduct,
                    images: [...currentImages, ...results]
                });
            });
        }
    };

    const removeGalleryImage = (index) => {
        const newImages = [...(currentProduct.images || [currentProduct.image])];
        if (newImages.length > 1) { 
            newImages.splice(index, 1);
            setCurrentProduct({...currentProduct, images: newImages});
            // if they remove the first image, make the new first image the primary cover
            if (index === 0 && newImages.length > 0) {
                 setCurrentProduct(prev => ({...prev, images: newImages, image: newImages[0]}));
            }
        } else {
            alert('A deal must have at least one image.');
        }
    };

    return (`;

content = content.replace('    return (', handlersCode);


// 3. Inject View Gallery below exactly: {currentProduct.badge && (...)} (Line 523~)
const viewGalleryCode = `
                                {currentProduct.badge && (
                                    <div style={{position: 'absolute', top: '16px', left: '16px', background: '#ef4444', color: 'white', padding: '6px 16px', borderRadius: '50px', fontWeight: '900', fontSize: '0.85rem'}}>
                                        {currentProduct.badge}
                                    </div>
                                )}
                            </div>
                            
                            {/* Display Thumbnail Gallery if multiple images exist */}
                            {currentProduct.images && currentProduct.images.length > 1 && (
                                <div style={{display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto'}}>
                                    {currentProduct.images.map((imgSrc, idx) => (
                                        <div key={idx} style={{width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '2px solid', borderColor: currentProduct.image === imgSrc ? '#3b82f6' : 'transparent', cursor: 'pointer', flexShrink: 0}}>
                                            <img src={imgSrc} alt="thumbnail" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                        </div>
                                    ))}
                                </div>
                            )}`;

content = content.replace(
    /\{\s*currentProduct\.badge && \([\s\S]*?\}\s*\)\s*\}\s*<\/div>/,
    viewGalleryCode
);

// 4. Update the Media section in Edit Modal
const editMediaCode = `
                                {/* 5. Media */}
                                <div className="mp-edit-section">
                                    <div className="mp-section-title">
                                        <ImageIcon size={20} />
                                        <h4>Deal Banner/Images</h4>
                                    </div>
                                    <p style={{fontSize: '0.85rem', color: '#64748b', marginBottom: '16px'}}>First image acts as the cover thumbnail. Max 5 images allowed.</p>
                                    
                                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
                                        {/* Display Existing Images */}
                                        {(currentProduct.images || [currentProduct.image]).map((imgSrc, idx) => (
                                            <div key={idx} style={{position: 'relative', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '2px dashed #cbd5e1'}}>
                                                <img src={imgSrc} alt="deal" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                                <button type="button" onClick={() => removeGalleryImage(idx)} style={{position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex'}}>
                                                    <X size={14} />
                                                </button>
                                                {idx === 0 && <span style={{position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.7rem', padding: '4px', textAlign: 'center', fontWeight: 'bold'}}>COVER</span>}
                                            </div>
                                        ))}

                                        {/* Add New Image Button */}
                                        {(currentProduct.images || [currentProduct.image]).length < 5 && (
                                            <label style={{width: '120px', height: '120px', borderRadius: '12px', border: '2px dashed #94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f8fafc', gap: '8px', color: '#64748b'}}>
                                                <UploadCloud size={24} />
                                                <span style={{fontSize: '0.8rem', fontWeight: 'bold'}}>Add Image</span>
                                                <input type="file" multiple accept="image/*" style={{display: 'none'}} onChange={handleGalleryImageChange} />
                                            </label>
                                        )}
                                    </div>
                                </div>
`;

content = content.replace(
    /\{\/\* 5\. Media \*\/\}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/,
    editMediaCode
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added Gallery editing and viewing capabilities to ManageDeals.');
