Ext.define('EasyTreatyApp.store.Specialization', {
    extend: 'Ext.data.Store',

    config: {
        data: [
                    { text: 'Cardiologist', value: 'first' },
                    { text: 'Dentist', value: 'second' },
                    { text: ' Immunologist', value: 'third' }
        ]
    }
});
