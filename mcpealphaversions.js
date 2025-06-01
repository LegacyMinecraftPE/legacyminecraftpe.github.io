$(document).ready(function () {
    let versions = [];

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const initialType = getUrlParameter('type') || 'All';

    $.getJSON('mcpealphaversions.json', function (data) {
        versions = data;
        displayVersions(initialType);
    });

    function getTableClasses() {
        const isDarkTheme = document.body.classList.contains('dark-theme') || 
                           document.documentElement.classList.contains('dark-theme') ||
                           window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (isDarkTheme) {
            return 'table table-dark table-striped table-hover';
        } else {
            return 'table table-striped table-hover';
        }
    }

    function displayVersions(type) {
        $('#version-list').empty();
        const filteredVersions = versions.filter(version => {
            const versionTypes = version.type.split(',').map(type => type.trim());
            return type === 'All' || versionTypes.includes(type);
        });

        let tableHTML = `<table class="${getTableClasses()}"><thead class="table-dark"><tr><th class="text-start">Version</th><th class="text-start">Download</th></tr></thead><tbody>`;
        filteredVersions.forEach(version => {
            tableHTML += `
                <tr>
                    <td class="text-start">${version.version}</td>
                    <td class="text-start"><a href="${version.download_link}" target="_blank" class="btn btn-primary">Download</a></td>
                </tr>
            `;
        });
        tableHTML += '</tbody></table>';
        $('#version-list').append(tableHTML);

        $('.tab').removeClass('active');
        $(`.tab[data-type="${type}"]`).addClass('active');
    }

    $('.tab').on('click', function () {
        const type = $(this).data('type');
        displayVersions(type);

        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?type=' + type;
        window.history.pushState({ path: newUrl }, '', newUrl);
    });

    $('#search-input').on('keyup', function () {
        const query = $(this).val().toLowerCase();
        $('#version-list').empty();
        const filteredVersions = versions.filter(version => version.version.toLowerCase().includes(query));
        
        let tableHTML = `<table class="${getTableClasses()}"><thead class="table-dark"><tr><th class="text-start">Version</th><th class="text-start">Download</th></tr></thead><tbody>`;
        filteredVersions.forEach(version => {
            tableHTML += `
                <tr>
                    <td class="text-start">${version.version}</td>
                    <td class="text-start"><a href="${version.download_link}" target="_blank" class="btn btn-primary">Download</a></td>
                </tr>
            `;
        });
        tableHTML += '</tbody></table>';
        $('#version-list').append(tableHTML);
    });
});