fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('orangeCapChart').getContext('2d');
        const seasonSelect = document.getElementById('season-select');

        let chart;

        const createChart = (season) => {
            const seasonData = data[season];
            if (chart) chart.destroy();

            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: seasonData.map(player => player.player),
                    datasets: [{
                        label: `Top 10 Players - ${season}`,
                        data: seasonData.map(player => player.runs),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        };

        createChart(seasonSelect.value);

        seasonSelect.addEventListener('change', (event) => {
            createChart(event.target.value);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
