import { Component } from '@angular/core';

export class ValidacionesComponent {

    static patternOnlyNames(): RegExp {
        return /^[A-ZÑÁÉÍÓÚ][a-zñáéíóú]{1,30}$/;
    }
    
    static patternOnlyLettersValidator(): RegExp {
        return /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]{2,20}$/;
    } 

    static patterOnlyNumbersValidator(): RegExp {
        return /^[0-9]{10}$/;
    }

    static patternOnlyLettersAndNumbersValidator(): RegExp {
        return /^[a-zA-Z][a-zA-Z0-9]{1,9}$/;
    }

    static patternPasswordValidator(): RegExp {
        return/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W\_])[A-Za-z\d\W\_]{8,}$/;
    }

    static patternEmailValidator(): RegExp {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    }

    static patternRucValidator(): RegExp {
        return /^[0-9]{13}$/;
    }

    static patternWebsiteValidator(): RegExp {
        return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
    }

    static patternPeriodNameValidator(): RegExp {
        return /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s0-9]{5,200}$/;
    }

    static patternDescripValidator(): RegExp {
        return /^[A-ZÑÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ\s0-9;.,'"-]{5,255}$/;
    }
    
    static patterntitleValidator(): RegExp {
        return /^[A-ZÑÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ]*(?:\s[a-zA-ZñÑáéíóúÁÉÍÓÚ]+)*$/;
    } 
    
    static patternActividaValidator(): RegExp {
        return /^[A-ZÑÁÉÍÓÚ][a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{4,49}$/;
    }

    static patternTipoActiValidator(): RegExp {
        return /^[A-ZÑÁÉÍÓÚ][a-zñáéíóú\s]{1,30}$/;
    }
    
}