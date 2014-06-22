Ext.define('EasyTreatyApp.store.Specialization', {
    extend: 'Ext.data.Store',

    config: {
        data: [
                    { text: 'Acupuncturist', value: ['Acupuncturist'] },
                    { text: 'Allergist', value: ['Immunologist', 'Allergist'] },
                    { text: 'Cardiologist', value: ['cardiology', 'heart', 'Cardiologist'] },
                    { text: 'Chiropractor', value: ['Chiropractor'] },
                    { text: 'Dentist', value: ['Dentist', 'tooth'] },
                    { text: 'Dermatologist', value: ['ENT'] },
                    { text: 'Dietitian', value: ['Acupuncturist'] },
                    { text: 'ENT Doctor', value: ['Acupuncturist'] },
                    { text: 'Endocrinolgist', value: ['Endocrinolgist'] },
                    { text: 'Eye Doctor', value: ['Eye'] },
                    { text: 'Gastroenterlogist', value: ['Gastroenterlogist'] },
                    { text: 'Hematologist', value: ['Hematologist'] },
                    { text: 'Infections Disease Specialist', value: ['Infections'] },
                    { text: 'Infertulity Specialist', value: ['Infertulity'] },
                    { text: 'Midwife', value: ['Midwife'] },
                    { text: 'Naturopathic Doctor', value: ['Naturopathic'] },
                    { text: 'Nephrologist', value: ['Nephrologist'] },
                    { text: 'Neurosurgeon', value: ['Neurosurgeon'] },
                    { text: 'OB-GYN', value: ['OB-GYN'] },
                    { text: 'Ophthalmologist', value: ['Ophthalmologist'] },
                    { text: 'Optomerist', value: ['Acupuncturist'] },
                    { text: 'Orthopedist', value: ['Orthopedist'] },
                    { text: 'Pain Management Specialist', value: ['Pain Management Specialist'] },
                    { text: 'Pediatric Dentist', value: ['Pediatric Dentist'] },
                    { text: 'Pediatrician', value: ['Pediatrician'] },
                    { text: 'Physiatrist', value: ['Physiatrist'] },
                    { text: 'Physical Therapist', value: ['Physical Therapist'] },
                    { text: 'Plastic Srugeon', value: ['Podiatrist'] },
                    { text: 'Podiatrist', value: ['Podiatrist','foot','knee'] },
                    { text: 'Primary Care Doctor', value: ['doctor'] },
                    { text: 'Prosthodontist', value: ['Prosthodontist'] },
                    { text: 'Psychiatrist', value: ['Psychiatrist'] },
                    { text: 'Psycologist', value: ['Psycologist', 'Psycology'] },
                    { text: 'Pulmonologist', value: ['lung', 'Pulmonologist'] },
                    { text: 'Radiologist', value: ['Radiologist','Radiolgy'] },
                    { text: 'Sleep Medicine Specialist', value: ['Sleep Medicine Specialist'] },
                    { text: 'Surgeon', value: ['Surgeon'] },
                    { text: 'Therapist', value: ['Therapist'] },
                    { text: 'Urologist', value: ['Urologist'] },
                    { text: 'Vascular Surgeon', value: ['Vascular'] }

        ]
    }
});
