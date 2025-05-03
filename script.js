document.addEventListener('DOMContentLoaded', function () {
    // 获取DOM元素
    const textInput = document.getElementById('text-input');
    const fontSizeInput = document.getElementById('font-size');
    const letterSpacingInput = document.getElementById('letter-spacing');
    const lineHeightInput = document.getElementById('line-height');
    const textColorInput = document.getElementById('text-color');
    const bgColorInput = document.getElementById('bg-color');
    const enableTransparentCheckbox = document.getElementById('enable-transparent');
    const enableShadowCheckbox = document.getElementById('enable-shadow');
    const shadowOptions = document.getElementById('shadow-options');
    const shadowColorInput = document.getElementById('shadow-color');
    const shadowBlurInput = document.getElementById('shadow-blur');
    const shadowOffsetXInput = document.getElementById('shadow-offset-x');
    const shadowOffsetYInput = document.getElementById('shadow-offset-y');
    const generateBtn = document.getElementById('generate-btn');
    const exportBtn = document.getElementById('export-btn');
    const showImageBtn = document.getElementById('show-image-btn');
    const exportError = document.getElementById('export-error');
    const resetBtn = document.getElementById('reset-btn');
    const textPreview = document.getElementById('text-preview');
    const previewContainer = document.getElementById('preview-container');
    const canvas = document.getElementById('canvas');
    // 社交媒体相关
    const qqGroupBtn = document.getElementById('qq-group-btn');
    const wechatBtn = document.getElementById('wechat-btn');

    let ctx = canvas.getContext('2d');

    // 存储最后生成的图片数据
    let lastImageData = null;

    // 默认值
    const defaultSettings = {
        fontSize: 48,
        letterSpacing: 0,
        lineHeight: 1.5,
        textColor: '#e60000',
        bgColor: '#ffffff',
        enableTransparent: false,
        enableShadow: false,
        shadowColor: '#000000',
        shadowBlur: 4,
        shadowOffsetX: 2,
        shadowOffsetY: 2
    };

    // 加载字体
    const fontLoader = new FontFace('HYYingXiongTi', 'url(HYDiShengYingXiongTiW.ttf)');

    fontLoader.load().then(function (loadedFont) {
        document.fonts.add(loadedFont);
        console.log('字体加载成功');

        // 字体加载完成后，默认生成一次预览
        if (textInput.value) {
            generatePreview();
        } else {
            // 添加示例文字
            textInput.value = '权威';
            generatePreview();
        }
    }).catch(function (error) {
        console.error('字体加载失败:', error);
        alert('英雄体字体加载失败，请确保字体文件存在并刷新页面。');
    });

    // 阴影设置显示切换
    enableShadowCheckbox.addEventListener('change', function () {
        shadowOptions.style.display = this.checked ? 'block' : 'none';
        generatePreview();
    });

    // 社交媒体功能
    if (qqGroupBtn) {
        qqGroupBtn.addEventListener('click', function () {
            // 复制QQ群号到剪贴板
            const groupNumber = '300939539'; // 替换为实际QQ群号
            navigator.clipboard.writeText(groupNumber).then(function () {
                showToast('QQ群号已复制到剪贴板');
            }).catch(function () {
                alert('QQ群号：300939539');
            });
        });
    }

    if (wechatBtn) {
        wechatBtn.addEventListener('click', function () {
            // 可以添加点击微信公众号按钮的动作，比如显示二维码等
            // 这里简单地滚动到二维码部分
            const qrcodeContainer = document.querySelector('.qrcode-container');
            if (qrcodeContainer) {
                qrcodeContainer.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 显示提示信息
    function showToast(message) {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '1000';

        // 添加到页面
        document.body.appendChild(toast);

        // 2秒后删除
        setTimeout(function () {
            document.body.removeChild(toast);
        }, 2000);
    }

    // 生成预览
    function generatePreview() {
        const text = textInput.value || '权威';
        const fontSize = `${fontSizeInput.value}px`;
        const letterSpacing = `${letterSpacingInput.value}px`;
        const lineHeight = lineHeightInput.value;
        const textColor = textColorInput.value;
        const bgColor = bgColorInput.value;
        const transparentBg = enableTransparentCheckbox.checked;

        // 更新预览区域
        textPreview.style.fontSize = fontSize;
        textPreview.style.letterSpacing = letterSpacing;
        textPreview.style.lineHeight = lineHeight;
        textPreview.style.color = textColor;

        // 处理背景 - 如果是透明背景，显示棋盘格图案
        if (transparentBg) {
            previewContainer.style.backgroundColor = 'transparent';
            previewContainer.style.backgroundImage = 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)';
            previewContainer.style.backgroundSize = '20px 20px';
            previewContainer.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
        } else {
            previewContainer.style.backgroundColor = bgColor;
            previewContainer.style.backgroundImage = 'none';
        }

        textPreview.textContent = text;

        // 应用文字阴影
        if (enableShadowCheckbox.checked) {
            const shadowColor = shadowColorInput.value;
            const shadowBlur = `${shadowBlurInput.value}px`;
            const shadowOffsetX = `${shadowOffsetXInput.value}px`;
            const shadowOffsetY = `${shadowOffsetYInput.value}px`;
            textPreview.style.textShadow = `${shadowOffsetX} ${shadowOffsetY} ${shadowBlur} ${shadowColor}`;
        } else {
            textPreview.style.textShadow = 'none';
        }

        // 调整预览容器样式
        adaptPreviewSize();
    }

    // 根据文本内容调整预览大小
    function adaptPreviewSize() {
        // 获取当前文本内容
        const text = textInput.value || '权威';
        const fontSize = parseInt(fontSizeInput.value, 10);
        const letterSpacing = parseInt(letterSpacingInput.value, 10);
        const lineHeight = parseFloat(lineHeightInput.value);

        // 调整预览文本的宽度，确保文本不会超出预览区域
        const previewWidth = previewContainer.clientWidth;
        const previewHeight = previewContainer.clientHeight;

        // 获取文本元素的原始尺寸
        const originalFontSize = fontSize;
        textPreview.style.fontSize = `${originalFontSize}px`;
        textPreview.style.letterSpacing = `${letterSpacing}px`;
        textPreview.style.lineHeight = lineHeight;

        // 重置宽度，确保准确测量
        textPreview.style.width = 'auto';

        // 延迟获取尺寸以确保样式已应用
        setTimeout(() => {
            const textWidth = textPreview.offsetWidth;
            const textHeight = textPreview.offsetHeight;

            // 计算最大可用空间（预览容器的70%）
            const maxWidth = previewWidth * 0.7;
            const maxHeight = previewHeight * 0.7;

            // 检查是否需要缩放字体
            if (textWidth > maxWidth || textHeight > maxHeight) {
                // 计算缩放比例
                const scaleX = maxWidth / textWidth;
                const scaleY = maxHeight / textHeight;
                const scale = Math.min(scaleX, scaleY);

                // 应用缩放后的字体大小
                const scaledFontSize = Math.floor(originalFontSize * scale);
                textPreview.style.fontSize = `${scaledFontSize}px`;
            }

            // 居中显示
            textPreview.style.position = 'absolute';
            textPreview.style.left = '50%';
            textPreview.style.top = '50%';

            // 微调垂直居中，确保完全居中，略微向下移动以补偿基线偏差
            textPreview.style.transform = 'translate(-50%, -48%)';

            // 为空白文本添加最小高度，确保能显示
            if (!text.trim()) {
                textPreview.style.minHeight = '1em';
            }
        }, 10);
    }

    // 计算文本宽度和高度，返回正方形尺寸
    function measureText(text, fontSize, letterSpacing, lineHeight) {
        const lines = text.split('\n');

        // 创建临时Canvas用于测量文本宽度
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.font = `${fontSize}px 'HYYingXiongTi', 'Microsoft YaHei', sans-serif`;

        // 计算字间距影响下的文本宽度
        let maxWidth = 0;
        lines.forEach(line => {
            // 基础宽度
            const metrics = tempCtx.measureText(line);
            // 加上字间距的影响 (字符数-1) * 字间距
            const totalWidth = metrics.width + (line.length - 1) * letterSpacing;
            maxWidth = Math.max(maxWidth, totalWidth);
        });

        // 计算考虑行高的总高度
        const totalHeight = lines.length * fontSize * lineHeight;

        // 确保返回正方形尺寸，并添加足够的内边距
        const size = Math.max(maxWidth, totalHeight) + 160;

        return {
            width: size,
            height: size,
            contentWidth: maxWidth,
            contentHeight: totalHeight
        };
    }

    // 导出为图片
    function exportImage() {
        try {
            // 获取文本内容和样式
            const text = textInput.value || '权威';
            const fontSize = parseInt(fontSizeInput.value, 10);
            const letterSpacing = parseInt(letterSpacingInput.value, 10);
            const lineHeight = parseFloat(lineHeightInput.value);
            const textColor = textColorInput.value;
            const bgColor = bgColorInput.value;
            const transparentBg = enableTransparentCheckbox.checked;

            // 隐藏之前的错误提示和显示图片按钮
            showImageBtn.style.display = 'none';
            exportError.style.display = 'none';

            // 计算文本尺寸
            const { width, height, contentWidth, contentHeight } = measureText(text, fontSize, letterSpacing, lineHeight);

            // 调整字体大小
            let adjustedFontSize = fontSize;
            let adjustedLetterSpacing = letterSpacing;

            // 自适应调整字体大小
            if (contentWidth > width * 0.7 || contentHeight > height * 0.7) {
                const scaleX = (width * 0.7) / contentWidth;
                const scaleY = (height * 0.7) / contentHeight;
                const scale = Math.min(scaleX, scaleY);

                adjustedFontSize = Math.floor(fontSize * scale);
                adjustedLetterSpacing = Math.floor(letterSpacing * scale);
            }

            // 重置画布
            canvas.width = width * 2;  // 2倍分辨率
            canvas.height = height * 2;

            // 获取上下文
            ctx = canvas.getContext('2d', { alpha: true });  // 启用透明度

            // 缩放提高清晰度
            ctx.scale(2, 2);

            // 清除画布
            ctx.clearRect(0, 0, width, height);

            // 绘制背景（如果不是透明背景）
            if (!transparentBg) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, width, height);
            }

            // 设置文本样式
            ctx.fillStyle = textColor;
            ctx.font = `${adjustedFontSize}px 'HYYingXiongTi', 'Microsoft YaHei', sans-serif`;
            ctx.textBaseline = 'top';

            // 设置阴影
            if (enableShadowCheckbox.checked) {
                ctx.shadowColor = shadowColorInput.value;
                ctx.shadowBlur = parseInt(shadowBlurInput.value, 10);
                ctx.shadowOffsetX = parseInt(shadowOffsetXInput.value, 10);
                ctx.shadowOffsetY = parseInt(shadowOffsetYInput.value, 10);
            }

            // 计算所有行的高度和位置
            const lines = text.split('\n');
            let totalHeight = 0;
            const lineHeights = [];
            const lineWidths = [];

            // 计算每行的宽度和预估高度
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                let lineWidth;

                if (adjustedLetterSpacing !== 0) {
                    const metrics = ctx.measureText(line);
                    lineWidth = metrics.width + (line.length - 1) * adjustedLetterSpacing;
                } else {
                    lineWidth = ctx.measureText(line).width;
                }
                lineWidths.push(lineWidth);

                // 计算行高
                let lineHeight;
                if (i < lines.length - 1) {
                    // 非最后一行考虑行间距
                    lineHeight = adjustedFontSize * parseFloat(lineHeightInput.value);
                } else {
                    // 最后一行只考虑字体大小
                    lineHeight = adjustedFontSize;
                }
                lineHeights.push(lineHeight);
                totalHeight += lineHeight;
            }

            // 垂直居中的起始Y坐标，向下偏移2px以微调居中效果
            const startY = (height - totalHeight) / 2 + 2;

            // 逐行绘制文本
            let currentY = startY;
            lines.forEach((line, index) => {
                // 计算当前行的水平居中位置
                const lineStartX = Math.floor((width - lineWidths[index]) / 2);

                // 绘制文本
                if (adjustedLetterSpacing !== 0) {
                    // 逐字绘制
                    let xPos = lineStartX;
                    for (let i = 0; i < line.length; i++) {
                        ctx.fillText(line[i], xPos, currentY);
                        const charWidth = ctx.measureText(line[i]).width;
                        xPos += charWidth + adjustedLetterSpacing;
                    }
                } else {
                    // 整行绘制
                    ctx.fillText(line, lineStartX, currentY);
                }

                // 更新下一行的Y坐标
                currentY += lineHeights[index];
            });

            // 重置阴影
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // 保存图片数据
            try {
                lastImageData = canvas.toDataURL('image/png');

                // 显示成功提示
                showToast('导出成功！');
            } catch (e) {
                console.warn('无法保存图片数据:', e);
            }

            // 第一种方法：直接使用toDataURL
            try {
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = '英雄体文字.png';
                link.href = dataUrl;
                link.click();
                return; // 如果成功，直接返回
            } catch (error) {
                console.warn('第一种导出方法失败，尝试第二种方法', error);
            }

            // 第二种方法：使用blob
            try {
                canvas.toBlob(function (blob) {
                    if (!blob) {
                        throw new Error('无法创建Blob对象');
                    }

                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = '英雄体文字.png';
                    link.href = url;
                    link.click();

                    // 清理URL对象
                    setTimeout(function () {
                        URL.revokeObjectURL(url);
                    }, 100);
                }, 'image/png');
            } catch (error) {
                console.error('第二种导出方法也失败', error);

                // 显示错误和备用按钮
                showImageBtn.style.display = 'inline-block';
                exportError.style.display = 'block';

                throw error; // 重新抛出以便被外层catch捕获
            }

        } catch (e) {
            console.error('导出图片失败:', e);

            // 显示错误和备用按钮
            showImageBtn.style.display = 'inline-block';
            exportError.style.display = 'block';

            alert('导出图片失败：' + e.message + '\n请点击"显示图片"按钮，然后右键图片选择"另存为"保存。');
        }
    }

    // 显示图片
    function showImage() {
        if (!lastImageData) {
            alert('请先生成图片');
            return;
        }

        // 创建新窗口显示图片
        const win = window.open();
        const transparentBg = enableTransparentCheckbox.checked;

        win.document.write(`
            <html>
                <head>
                    <title>英雄体文字 - 另存为</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            background-color: #f5f5f5;
                            font-family: 'Microsoft YaHei', sans-serif;
                        }
                        h3 {
                            margin-bottom: 20px;
                            color: #333;
                        }
                        .image-container {
                            ${transparentBg ? `
                            background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), 
                                              linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                                              linear-gradient(45deg, transparent 75%, #ccc 75%), 
                                              linear-gradient(-45deg, transparent 75%, #ccc 75%);
                            background-size: 20px 20px;
                            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                            ` : ''}
                            padding: 10px;
                            border: 1px solid #ddd;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        img {
                            max-width: 100%;
                            display: block;
                        }
                        p {
                            margin-top: 20px;
                            color: #666;
                        }
                        .note {
                            color: #e60000;
                            font-weight: bold;
                            margin-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <h3>请右键点击图片，选择"另存为"保存</h3>
                    <div class="image-container">
                        <img src="${lastImageData}" alt="英雄体文字">
                    </div>
                    ${transparentBg ? '<p class="note">注意：图片为透明背景，保存为PNG格式可保留透明效果</p>' : ''}
                    <p>如果图片未正确显示，请刷新页面重新生成。</p>
                </body>
            </html>
        `);
    }

    // 重置所有设置
    function resetSettings() {
        textInput.value = '权威';
        fontSizeInput.value = defaultSettings.fontSize;
        letterSpacingInput.value = defaultSettings.letterSpacing;
        lineHeightInput.value = defaultSettings.lineHeight;
        textColorInput.value = defaultSettings.textColor;
        bgColorInput.value = defaultSettings.bgColor;
        enableTransparentCheckbox.checked = defaultSettings.enableTransparent;
        enableShadowCheckbox.checked = defaultSettings.enableShadow;
        shadowColorInput.value = defaultSettings.shadowColor;
        shadowBlurInput.value = defaultSettings.shadowBlur;
        shadowOffsetXInput.value = defaultSettings.shadowOffsetX;
        shadowOffsetYInput.value = defaultSettings.shadowOffsetY;

        // 更新阴影设置区域显示
        shadowOptions.style.display = defaultSettings.enableShadow ? 'block' : 'none';

        // 更新预览
        generatePreview();

        // 显示提示
        showToast('已重置为默认设置');
    }

    // 按钮事件监听
    generateBtn.addEventListener('click', generatePreview);
    exportBtn.addEventListener('click', exportImage);
    showImageBtn.addEventListener('click', showImage);
    resetBtn.addEventListener('click', resetSettings);

    // 文本输入实时预览
    textInput.addEventListener('input', function () {
        if (document.fonts.check("12px 'HYYingXiongTi'")) {
            generatePreview();
        }
    });

    // 其他控件的变更事件
    fontSizeInput.addEventListener('input', generatePreview);
    letterSpacingInput.addEventListener('input', generatePreview);
    lineHeightInput.addEventListener('input', generatePreview);
    textColorInput.addEventListener('input', generatePreview);
    bgColorInput.addEventListener('input', generatePreview);
    enableTransparentCheckbox.addEventListener('change', generatePreview);
    shadowColorInput.addEventListener('input', generatePreview);
    shadowBlurInput.addEventListener('input', generatePreview);
    shadowOffsetXInput.addEventListener('input', generatePreview);
    shadowOffsetYInput.addEventListener('input', generatePreview);

    // 监听窗口大小变化，调整预览
    window.addEventListener('resize', adaptPreviewSize);

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 初始调整预览容器
    setTimeout(adaptPreviewSize, 100);
}); 