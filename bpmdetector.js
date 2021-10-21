function getPeaksAtThreshold(data, threshold) {
    var peaksArray = [];
    var length = data.length;
    for(var i = 0; i < length;) {
        if (data[i] > threshold) {
            
            peaksArray.push(i);
            // Skip forward ~ 1/4s to get past this peak.
            i += 10000;
        }
        i++;
    }
    return peaksArray;
}

function countIntervalsBetweenNearbyPeaks(peaks) {
	var intervalCounts = [];
	peaks.forEach(function(peak, index) {
		for(var i = 1; i < 10; i++) {
			var interval = peaks[index + i] - peak;
			var foundInterval = intervalCounts.some(function(intervalCount) {
				if (intervalCount.interval == interval)
					return intervalCount.count++;
			});
            if (isNaN(foundInterval))
                return;
			if (!foundInterval) {
				intervalCounts.push({
					interval: interval,
					count: 1
				});
			}
		}
	});
	return intervalCounts;
}

function groupNeighborsByTempo(intervalCounts) {
    var tempoCounts = [];
    intervalCounts.forEach(function(intervalCount, i) {
        // Convert an interval to tempo
        var delim = intervalCount.interval / 48000;
        if (delim == 0)
            return;
        var theoreticalTempo = 60 / delim;     

        // Adjust the tempo to fit within the 90-180 BPM range
        while (theoreticalTempo < 90) theoreticalTempo *= 2;
        while (theoreticalTempo > 180) theoreticalTempo /= 2;
        theoreticalTempo = parseInt(theoreticalTempo);
        console.log(theoreticalTempo);

        if (isNaN(theoreticalTempo))
            return;

        var foundTempo = tempoCounts.some(function(tempoCount) {
            if (tempoCount.tempo === theoreticalTempo)
                return tempoCount.count += intervalCount.count;
        });

        if (!foundTempo) {
            tempoCounts.push({
                tempo: theoreticalTempo,
                count: intervalCount.count
            });
        }
    });
    return tempoCounts;
}