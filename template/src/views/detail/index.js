const ViewModule = {
    name: 'Detail',
    data () {
        const { id } = this.$route.params;
        return {
            id,
        };
    }
};

export default ViewModule;