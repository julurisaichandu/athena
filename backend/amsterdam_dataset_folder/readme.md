# README: ICU Dataset Documentation

## Overview

This dataset contains comprehensive information about patients admitted to the Intensive Care Unit (ICU) or Medium Care Unit (MCU). It includes detailed data on admissions, medications, procedures, lab results, and processes related to patient care. Each table is interlinked via unique `admissionid` values to ensure consistency and enable detailed analysis of patient care trajectories.

## Dataset Files

1. **Admissions Dataset**
2. **Medication Dataset**
3. **Results Dataset**
4. **Process Items Dataset**
5. **Procedure Order Items Dataset**

---

## Table Descriptions

### 1. Admissions Dataset
This table contains demographic and administrative data for all patients admitted to the ICU or MCU. Each record corresponds to a unique admission.

| **Field**             | **Type**    | **Description**                                                                                   |
|-----------------------|-------------|---------------------------------------------------------------------------------------------------|
| `patientid`           | integer     | Unique identifier for individual patients.                                                       |
| `admissionid`         | integer     | Unique identifier for each admission to the ICU/MCU.                                             |
| `admissioncount`      | integer     | Count of ICU/MCU admissions for the patient.                                                     |
| `location`            | string      | Department where the patient was admitted (ICU, MCU, or both).                                   |
| `urgency`             | bit         | Indicates if the admission was urgent (1: unplanned, 0: planned).                                |
| `origin`              | string      | Department the patient originated from (e.g., Emergency Department, Regular Ward).               |
| `admittedat`          | datetime    | Time of admission.                                                                               |
| `admissionyeargroup`  | string      | Year of admission.                                                                               |
| `dischargedat`        | datetime    | Time of discharge.                                                                               |
| `lengthofstay`        | integer     | Length of stay in hours.                                                                         |
| `destination`         | string      | Department the patient was discharged to, or "Deceased" if they passed away.                    |
| `gender`              | string      | Gender of the patient (Male, Female).                                                           |
| `agegroup`            | string      | Age of the patient at admission, categorized.                                                   |
| `dateofdeath`         | datetime    | Date of death, if applicable.                                                                   |
| `weightgroup`         | string      | Weight of the patient at admission, categorized.                                                |
| `weightsource`        | string      | Method used to determine weight (Measured, Estimated, Reported).                                |
| `heightgroup`         | string      | Height of the patient at admission, categorized.                                                |
| `heightsource`        | string      | Method used to determine height (Measured, Estimated, Reported).                                |
| `specialty`           | string      | Medical specialty of the admission reason.                                                      |

---

### 2. Medication Dataset
This table details all medications prescribed and administered during ICU/MCU admissions.

| **Field**                  | **Type**     | **Description**                                                                                  |
|----------------------------|--------------|--------------------------------------------------------------------------------------------------|
| `admissionid`              | integer      | Links the record to the respective admission.                                                   |
| `orderid`                  | integer      | Unique identifier for each medication order.                                                    |
| `ordercategoryid`          | integer      | Identifier for the category of medication (e.g., antibiotics, fluids).                         |
| `ordercategory`            | string       | Name of the medication category.                                                                |
| `itemid`                   | integer      | Identifier for the specific medication.                                                         |
| `item`                     | string       | Name of the medication.                                                                          |
| `isadditive`               | bit          | Indicates if the medication was an additive.                                                    |
| `isconditional`            | bit          | Indicates if the order was conditional.                                                         |
| `rate`                     | float        | Infusion rate (volume per time unit).                                                           |
| `rateunit`                 | string       | Unit of infusion rate (e.g., ml/hour).                                                          |
| `administered`             | float        | Amount of medication administered.                                                              |
| `action`                   | string       | Action related to the order (e.g., new bag, restart).                                           |
| `start`                    | datetime     | Start time of medication infusion.                                                              |
| `stop`                     | datetime     | Stop time of medication infusion.                                                               |

---

### 3. Results Dataset
This table contains lab results and observations recorded during ICU/MCU admissions.

| **Field**         | **Type**   | **Description**                                                                                   |
|-------------------|------------|---------------------------------------------------------------------------------------------------|
| `admissionid`     | integer    | Links the record to the respective admission.                                                    |
| `itemid`          | integer    | Identifier for the type of result.                                                               |
| `item`            | string     | Type of result (e.g., Blood Test, Urine Test).                                                   |
| `value`           | string     | Result value (e.g., Normal, Elevated).                                                           |
| `comment`         | string     | Comments associated with the result.                                                            |
| `measuredat`      | datetime   | Time the result was measured.                                                                    |
| `registeredat`    | datetime   | Time the result was recorded.                                                                    |
| `islabresult`     | bit        | Indicates if the observation is a lab result.                                                   |

---

### 4. Process Items Dataset
This table details procedures like catheter insertions or continuous processes administered during ICU/MCU admissions.

| **Field**         | **Type**   | **Description**                                                                                   |
|-------------------|------------|---------------------------------------------------------------------------------------------------|
| `admissionid`     | integer    | Links the record to the respective admission.                                                    |
| `itemid`          | integer    | Identifier for the type of process.                                                              |
| `item`            | string     | Name of the process (e.g., Central Line, Renal Replacement Therapy).                             |
| `start`           | datetime   | Start time of the process.                                                                       |
| `stop`            | datetime   | Stop time of the process.                                                                        |
| `duration`        | integer    | Duration of the process in minutes.                                                             |

---

### 5. Procedure Order Items Dataset
This table contains all procedure orders during ICU/MCU admissions.

| **Field**            | **Type**   | **Description**                                                                                 |
|----------------------|------------|-----------------------------------------------------------------------------------------------|
| `admissionid`        | integer    | Links the record to the respective admission.                                                |
| `orderid`            | integer    | Unique identifier for each procedure order.                                                  |
| `ordercategoryid`    | integer    | Identifier for the procedure category.                                                       |
| `ordercategoryname`  | string     | Name of the procedure category.                                                              |
| `itemid`             | integer    | Identifier for the specific procedure.                                                       |
| `item`               | string     | Name of the procedure (e.g., Blood Draw, Glasgow Coma Scale).                                |
| `registeredat`       | datetime   | Time the procedure order was registered.                                                     |
| `registeredby`       | string     | User group that registered the procedure (e.g., Nurses, Physicians).                        |

---

## Usage
This dataset provides a comprehensive view of patient care in the ICU/MCU, allowing for analyses of:

- Medication administration and effectiveness.
- Trends in lab results and their impact on patient outcomes.
- Utilization and impact of processes and procedures on patient care.
- Patient demographics and admission patterns.

---

## Notes
Each table is interlinked via the `admissionid` field, ensuring consistency and facilitating relational queries across datasets.