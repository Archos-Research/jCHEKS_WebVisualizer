var DataReader = function (databaseName) {
    var shared = {};
    shared.dataArray = [];
    shared.formatedObject = {};
    shared.counter = 0;
    var defaultLimit = 500;

    function resetDataArray() {
        shared.dataArray = [];
    }

    var self = {};

    self.sendDataRequest = function (config) {
        config.limit = (config.limit) ? config.limit : defaultLimit;
        resetDataArray();
        var dataToSend= "";
        dataToSend += "type=" + config.type;
        dataToSend += "&name=" + databaseName;
        dataToSend += ((config.system) ? "&system=" + config.system : "");
        dataToSend += ((config.limit) ? "&limit=" + config.limit : "");
        dataToSend += ((config.limitedRow) ? "&limitedRow=" + config.limitedRow : "");
        dataToSend += ((config.overallColumn) ? "&overallColumn=" + config.overallColumn : "");
        console.log(dataToSend.replace("&", "").split("&").join(",   ").split("=").join(" = "));
        $.ajax({
            url: "../php/getter.php",
            type: 'GET',
            dataType: 'json',
            async: false,
            data: dataToSend,
            success: config.formatter,
            error: function (msg) {
                $("body").html(msg.responseText);
            }
        });

        console.log(shared.dataArray.slice());
        return shared.dataArray.slice();
    }

    self.evolutionDataFormatter = function (receivedData) {
        for (var i = 0; i < receivedData.length; i++) {
            shared.formatedObject = {
                systemId: receivedData[i].chaotic_system_id,
                x: parseInt(receivedData[i].evolution_count)
            };
            shared.dataArray.push(shared.formatedObject);
        }
    };

    self.occurrenceDataFormatter = function (receivedData) {
        for (var i = 0; i < receivedData.length; i++) {
            shared.formatedObject = {
                systemId: receivedData[i].chaotic_system_id,
                y: parseInt(receivedData[i].agent_id),
                x: parseInt(receivedData[i].variation),
                color: parseInt(receivedData[i].occurence_count)

            };
            shared.dataArray.push(shared.formatedObject);
        }
    };

    self.overallOccurrenceDataFormatter = function (receivedData) {
        var name;
        var yValue = -1;
        for (var i = 0; i < receivedData.length; i++) {
            if (receivedData[i].chaotic_system_id != name) {
                yValue++;
                name = receivedData[i].chaotic_system_id;
            }
            shared.formatedObject = {
                systemId: receivedData[i].chaotic_system_id,
                y: yValue,
                x: parseInt(receivedData[i].groupIndex),
                color: parseInt(receivedData[i].overallSum)

            };
            shared.dataArray.push(shared.formatedObject);
        }
    };

    self.overallButterflyFormatter = function (receivedData) {
        var name;
        var yValue = -1;
        for (var i = 0; i < receivedData.length; i++) {
            if (receivedData[i].chaotic_system_id != name) {
                yValue++;
                name = receivedData[i].chaotic_system_id;
            }
            shared.formatedObject = {
                systemId: receivedData[i].chaotic_system_id,
                y: yValue,
                x: parseInt(receivedData[i].groupIndex),
                color: parseInt(receivedData[i].overallSum)

            };
            shared.dataArray.push(shared.formatedObject);
        }
    };

    self.butterflyDataFormatter = function (receivedData) {
        for (var i = 0; i < receivedData.length; i++) {
            shared.formatedObject = {
                systemId: receivedData[i].chaotic_system_id,
                y: parseInt(receivedData[i].clone_id),
                x: parseInt(receivedData[i].evolution_count),
                color: parseInt(receivedData[i].distance)
            };
            shared.dataArray.push(shared.formatedObject);
        }
    }

    self.NISTDataFormatter = function (receivedData) {
        for (var i = 0; i < receivedData.length; i++) {
            shared.formatedObject = {
                systemId: receivedData[i].chaotic_system_id,
                y: i,
                x: shared.counter,
                color: parseFloat(receivedData[i].p_value)
            };
            shared.dataArray.push(shared.formatedObject);
        }
    }

    self.distanceDataFormatter = function (data2) {
        for (var i = 0; i < data2.length; i++) {
            shared.formatedObject = {
                systemId: data2[i].chaotic_system_id,
                y: shared.counter,
                x: parseInt(data2[i].evolution_count),
                color: parseInt(data2[i].distance)
            };
            shared.dataArray.push(shared.formatedObject);
        }
    }

    self.nameListFormatter = function (receivedData) {
        for (var i = 0; i < receivedData.length; i++) {
            shared.dataArray.push(receivedData[i].chaotic_system_id);
        }
    }

    self.getOverallLevelOccurences = function () {
        return self.sendDataRequest({
            formatter: overallOccurrenceDataFormatter,
            type: "overallOccurenceLevel",
        });
    };

    self.getOverallVariationOccurences = function () {
        return self.sendDataRequest({
            formatter: overallOccurrenceDataFormatter,
            type: "overallOccurenceVariation",
        });
    };

    self.getOverallButterflyEffect = function () {
        return self.sendDataRequest({
            formatter: overallButterflyFormatter,
            type: "overallButterfly",
        });
    };

    self.getLevelOccurences = function (systemId) {
        return self.sendDataRequest({
            formatter: occurrenceDataFormatter,
            type: "occurenceLevel",
            system: systemId,
            limitedRow: "variation"
        });
    };

    self.getVariationOccurences = function (systemId) {
        return self.sendDataRequest({
            formatter: occurrenceDataFormatter,
            type: "occurenceVariation",
            system: systemId,
            limitedRow: "variation"
        });
    };

    self.getButterflyEffect = function (systemId) {
        return self.sendDataRequest({
            formatter: occurrenceDataFormatter,
            type: "butterfly",
            system: systemId,
            limitedRow: "evolution_count"
        });
    };

    self.getDistanceEvolutionForASystem = function (systemId) {
        return self.sendDataRequest({
            formatter: distanceDataFormatter,
            type: "distanceEvolution",
            system: systemId,
            limit: 150
        });
    };

    self.getDistanceEvolution = function () {
        var allDistanceData = [];
        var systemIds = self.getSystemNamesForDistanceEvolution();
        for (shared.counter = 0; shared.counter < systemIds.length; shared.counter++) {
            allDistanceData = allDistanceData.concat(self.getDistanceEvolutionForASystem(systemIds[shared.counter]));
        }
        return allDistanceData;
    };

    self.getNist = function () {

    };

    self.getSystemNameForAType(type){
        return self.sendDataRequest({
            formatter: nameListFormatter,
            type: type
        });
    }
    return self;
};
