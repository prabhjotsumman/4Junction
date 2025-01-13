function calculateWater() {
    const app = document.getElementById('app');
    const input = document.getElementById('block-heights').value;
    const heights = input.split(',').map(Number);
    
    if (heights.some(isNaN) || input === '') {
        alert('Please enter valid numbers separated by commas.');
        return;
    }

    const n = heights.length;
    
    const leftMax = Array(n).fill(0);
    const rightMax = Array(n).fill(0);

    leftMax[0] = heights[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
    }

    rightMax[n - 1] = heights[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
    }
    showResult(heights, leftMax, rightMax, n);
}

function showResult(heights, leftMax, rightMax, n) {
    let water = 0;
    const svg = document.getElementById('visualization');
    svg.innerHTML = '';

    const blockWidth = 40;
    const unitHeight = 20; // 1 unit of height = 20px
    const maxHeight = Math.max(...heights, ...leftMax, ...rightMax);
    svg.setAttribute('viewBox', `0 0 ${blockWidth * n} ${unitHeight * (maxHeight + 1)}`); // Responsive scaling

    for (let i = 0; i < n; i++) {
        const blockX = i * blockWidth;
        for (let j = 0; j < heights[i]; j++) {
            const block = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            block.setAttribute('class', 'block');
            block.setAttribute('x', blockX);
            block.setAttribute('y', unitHeight * (maxHeight - j));
            block.setAttribute('width', blockWidth);
            block.setAttribute('height', unitHeight);
            svg.appendChild(block);
        }

        // Calculate water height
        const waterHeight = Math.min(leftMax[i], rightMax[i]) - heights[i];
        for (let j = 0; j < waterHeight; j++) {
            const waterRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            waterRect.setAttribute('class', 'water');
            waterRect.setAttribute('x', blockX);
            waterRect.setAttribute('y', unitHeight * (maxHeight - heights[i] - j));
            waterRect.setAttribute('width', blockWidth);
            waterRect.setAttribute('height', unitHeight);

            svg.appendChild(waterRect);
        }

        water += waterHeight;
    }
    app.appendChild(svg);

    const result =document.getElementById('result');
    result.innerHTML = `Total water trapped: <b>${water}</b> units`;
    result.style.backgroundColor = `#ffe3a3`;
    app.appendChild(result);
}