import fs  from 'fs';
import path  from 'path';
import { parse } from 'csv-parse';


export default class ICUDataManager {
    constructor(inputDir) {
        this.mergedData = null;
        this.inputDir = inputDir;
    }
    async mergeDatasetsOnce() {
        if (this.mergedData) return this.mergedData;
    
        console.log('Merging ICU datasets...');
        const datasets = {};
    
        const readCSV = (filename) => {
            const filePath = path.join(this.inputDir, filename);
            
            // Check if file exists before attempting to read
            if (!fs.existsSync(filePath)) {
                console.warn(`File not found: ${filename}`);
                return null;
            }
        
            return new Promise((resolve, reject) => {
                try {
                    const results = [];
                    fs.createReadStream(filePath)
                        .pipe(parse({ columns: true }))
                        .on('data', (data) => results.push(data))
                        .on('end', () => resolve(results))
                        .on('error', (error) => {
                            console.error(`Error reading file ${filename}:`, error);
                            reject(error);
                        });
                } catch (error) {
                    console.error(`Unexpected error reading ${filename}:`, error);
                    reject(error);
                }
            });
        };
    
        try {
            // Read all datasets
            console.log('Reading datasets...');
            datasets.admissions = await readCSV('Admissions_Dataset.csv');
            console.log("admissions read");
            datasets.medications = await readCSV('Medication_Dataset.csv');
            console.log("medications read");
            datasets.results = await readCSV('Results_Dataset.csv');
            console.log("results read");
            datasets.processItems = await readCSV('Process_Items_Dataset.csv');
            datasets.procedureOrders = await readCSV('Procedure_Order_Items_Dataset.csv');

            if (!datasets.admissions || !datasets.medications || !datasets.results || !datasets.processItems || !datasets.procedureOrders) {
                console.error('Error reading datasets');
                return null;
            }
    
            // Merge datasets
            const mergedData = datasets.admissions.map(admission => {
                const admissionId = admission.admissionid;
    
                return {
                    ...admission,
                    medications: datasets.medications
                        .filter(med => med.admissionid === admissionId),
                    results: datasets.results
                        .filter(result => result.admissionid === admissionId),
                    processes: datasets.processItems
                        .filter(process => process.admissionid === admissionId),
                    procedures: datasets.procedureOrders
                        .filter(procedure => procedure.admissionid === admissionId),
                    // Flatten fields as needed
                    totalMedications: datasets.medications.filter(med => med.admissionid === admissionId).length,
                    totalResults: datasets.results.filter(result => result.admissionid === admissionId).length,
                    totalProcesses: datasets.processItems.filter(process => process.admissionid === admissionId).length,
                    totalProcedures: datasets.procedureOrders.filter(procedure => procedure.admissionid === admissionId).length,
                };
            });
    
            this.mergedData = mergedData;

            return mergedData;
        } catch (error) {
            console.error('Error merging datasets:', error);
            return null;
        }
    }
    

    async getData() {
        // If data not merged, merge it

        if (!this.mergedData) {
            await this.mergeDatasetsOnce();
        }
        return this.mergedData;
    }

        // Function to get unique values for categorical fields
        getUniqueCategoricalValues() {
            if (!this.mergedData) return null;
    
            const uniqueValues = {
                gender: new Set(),
                ageGroup: new Set(),
                specialty: new Set(),
                location: new Set(),
                medicationCategories: new Set(),
                procedureCategories: new Set(),
            };
    
            this.mergedData.forEach(admission => {
                // Add unique values for categorical fields
                if (admission.gender) uniqueValues.gender.add(admission.gender);
                if (admission.agegroup) uniqueValues.ageGroup.add(admission.agegroup);
                if (admission.specialty) uniqueValues.specialty.add(admission.specialty);
                if (admission.location) uniqueValues.location.add(admission.location);
                
                // Medications
                admission.medications.forEach(med => {
                    if (med.ordercategory) uniqueValues.medicationCategories.add(med.ordercategory);
                });
    
                // Procedures
                admission.procedures.forEach(proc => {
                    if (proc.ordercategoryname) uniqueValues.procedureCategories.add(proc.ordercategoryname);
                });
            });
    
            // Convert sets to arrays
            return {
                gender: Array.from(uniqueValues.gender),
                ageGroup: Array.from(uniqueValues.ageGroup),
                specialty: Array.from(uniqueValues.specialty),
                location: Array.from(uniqueValues.location),
                medicationCategories: Array.from(uniqueValues.medicationCategories),
                procedureCategories: Array.from(uniqueValues.procedureCategories),
            };
        }
}


