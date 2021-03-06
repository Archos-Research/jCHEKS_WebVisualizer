    function countEvolution_AllKeyBits(dataReader) {

        Layout.addTab("keyBits", "AllKeyBits");
        var id = "keyBits";
        var barChartSidebar = BarChartSidebar(id);
        var config = {
            height: Layout.getContainerHeight(),
            width: Layout.getContainerWidth(),
            target: id + "Svg",
            yAxisTitle: "System",
            xAxisTitle: "Evolutions",
            chartTitle: "Evolutions to see all bits of key"
        };
        var chart = Chart.BarChart(dataReader.getAllKeybits(), config);

        function updateConfig() {
            barChartSidebar.updateConfigs(config);
        }

        function updateChart() {
            chart.update(dataReader.getAllKeybits(), config);
            barChartSidebar.updateStats(chart.getStats());
        }

        var update = function () {
            updateConfig();
            updateChart();
        }

        var sideBarContents = [];
        sideBarContents.push(barChartSidebar.getHTML());
        sideBarContents.push($("<button>").text("update").click(update));
        Layout.setSidebarContent(id, sideBarContents);
    }
