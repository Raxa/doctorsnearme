Ext.define('EasyTreatyApp.store.Specialization', {
    extend: 'Ext.data.Store',

    config: {
        data: [
                    { text: 'Cardiologist', value: ['cardiology'] },
                    { text: 'Dentist', value: 'Dentist' },
                    { text: ' Immunologist', value: 'Immunologist' }
        ]
    }
});
