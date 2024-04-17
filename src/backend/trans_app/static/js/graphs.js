function getPlotGraph(data, xAxisName, yAxisName, width = 600, height = 400, showXAxisValues = true, showYAxisValues = true, xNumberType = 'fractionary', yNumberType = 'fractionary') {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Variables for padding and width/height of the graph
    const labelPadding = 65; // Increased padding to ensure axis labels fit.
	const valuePadding = 20; // Padding for axis values
    const plotWidth = canvas.width - 2 * labelPadding;
    const plotHeight = canvas.height - 2 * labelPadding;

    // Find the max values and min values for scaling
    const minX = Math.min(...data[0]);
    const maxX = Math.max(...data[0]);
    const maxY = Math.max(...data[1]);

    // Function to scale x coordinate
    function scaleX(x) {
        return labelPadding + ((x - minX) / (maxX - minX)) * plotWidth;
    }

    // Function to scale y coordinate
    function scaleY(y) {
        return canvas.height - labelPadding - (y / maxY) * plotHeight;
    }

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(labelPadding, labelPadding);
    ctx.lineTo(labelPadding, canvas.height - labelPadding);
    ctx.lineTo(canvas.width - labelPadding, canvas.height - labelPadding);
    ctx.stroke();

    // Plotting the points and the dotted lines
    ctx.strokeStyle = '#ff0000';  // Line color for the plot
    ctx.beginPath();
    ctx.moveTo(scaleX(data[0][0]), scaleY(data[1][0])); // Move to the first point
    for (let i = 0; i < data[0].length; i++) {
        const x = scaleX(data[0][i]);
        const y = scaleY(data[1][i]);

        // Connect data point to the X-axis
        ctx.save();
        ctx.setLineDash([5, 3]); // Creating dotted lines
        ctx.lineWidth = 1; // Line width
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, canvas.height - labelPadding);
        ctx.strokeStyle = '#888';  // Dotted line color
        ctx.stroke();
        ctx.restore();

        // Connect data point to the Y-axis
        ctx.save();
        ctx.setLineDash([5, 3]); // Creating dotted lines
        ctx.lineWidth = 1; // Line width
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(labelPadding, y);
        ctx.strokeStyle = '#888';  // Dotted line color
        ctx.stroke();
        ctx.restore();

        // Draw point
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        if (i > 0) {
            ctx.setLineDash([]); // Reset to solid line
            ctx.beginPath();
            ctx.moveTo(scaleX(data[0][i - 1]), scaleY(data[1][i - 1])); // Start from last point
            ctx.lineTo(x, y); // Draw to current point
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();
        }
        
        // Attach corresponding values to the axes
        if (showXAxisValues) {
            const xAxisIntersection = labelPadding + ((data[0][i] - minX) / (maxX - minX)) * plotWidth;
            const xValue = (xNumberType === 'integer') ? Math.round(data[0][i]) : data[0][i].toFixed(1);
            ctx.fillStyle = "#000";
            ctx.font = "14px Arial, sans-serif";
            ctx.textAlign = 'center';
            ctx.fillText(xValue, xAxisIntersection, canvas.height - labelPadding + 15);
        }
        
        if (showYAxisValues) {
            const yAxisIntersection = canvas.height - labelPadding - (data[1][i] / maxY) * plotHeight;
            const yValue = (yNumberType === 'integer') ? Math.round(data[1][i]) : data[1][i].toFixed(1);
            ctx.fillStyle = "#000";
            ctx.font = "14px Arial, sans-serif";
            ctx.textAlign = 'right';
            ctx.fillText(yValue, labelPadding - 5, yAxisIntersection);
        }
    }

    // Label axes
    ctx.fillStyle = "#000"; // Text color
    ctx.font = "bold 16px Arial, sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText(xAxisName, canvas.width / 2, canvas.height - 20);
    ctx.save();
    ctx.translate(30, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yAxisName, 0, 0);
    ctx.restore();

    return canvas;
}
