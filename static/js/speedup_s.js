
window.addEventListener("load", extendedStatisticsAjax);

var extended_statistics;

function extendedStatisticsAjax() {
    ajax('POST', '/get_extended_statistics', 0, function (result) {
        extended_statistics = JSON.stringify(result.data);
        localStorage.setItem("extended_statistics", extended_statistics);

    });
}

