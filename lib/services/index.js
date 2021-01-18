const ProjectService = require('./project-service');
const StateService = require('./state-service');
const ClientMetricsService = require('./client-metrics');
const TagTypeService = require('./tag-type-service');

module.exports.createServices = (stores, config) => ({
    projectService: new ProjectService(stores, config),
    stateService: new StateService(stores, config),
    tagTypeService: new TagTypeService(stores, config),
    clientMetricsService: new ClientMetricsService(stores, config),
});
