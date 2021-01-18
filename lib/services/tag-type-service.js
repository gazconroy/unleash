const NameExistsError = require('../error/name-exists-error');
const schema = require('./tag-type-schema');
const {
    TAG_TYPE_CREATED,
    TAG_TYPE_DELETED,
    TAG_TYPE_UPDATED,
} = require('../events');

class TagTypeService {
    constructor({ tagTypeStore, eventStore }, { getLogger }) {
        this.tagTypeStore = tagTypeStore;
        this.eventStore = eventStore;
        this.logger = getLogger('services/tag-type-service.js');
    }

    async getTagTypes() {
        return this.tagTypeStore.getTagTypes();
    }

    async getTagType(name) {
        return this.tagTypeStore.getTagType(name);
    }

    async createTagType(newTagType, userName) {
        const data = await schema.validateAsync(newTagType);
        await this.validateUniqueName(newTagType);
        const tagType = await this.tagTypeStore.createTagType(newTagType);
        await this.eventStore.store({
            type: TAG_TYPE_CREATED,
            createdBy: userName || 'unleash-system',
            data,
        });
        return tagType;
    }

    async validateUnique(name) {
        if (this.tagTypeStore.exists(name)) {
            throw new NameExistsError(
                `There's already a tag-type with the name ${name}`,
            );
        }
    }

    async validate(tagType) {
        await schema.validateAsync(tagType);
        await this.validateUnique(tagType.name);
    }

    async deleteTagType(name, userName) {
        await this.tagTypeStore.deleteTagType(name);
        await this.eventStore.store({
            type: TAG_TYPE_DELETED,
            createdBy: userName || 'unleash-system',
            data: { name },
        });
    }

    async updateTagType(updatedTagType, userName) {
        const data = await schema.validateAsync(updatedTagType);
        await this.tagTypeStore.updateTagType(data);
        await this.eventStore.store({
            type: TAG_TYPE_UPDATED,
            createdBy: userName || 'unleash-system',
            data,
        });
    }
}

module.exports = TagTypeService;
