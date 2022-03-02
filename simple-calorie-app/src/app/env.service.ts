import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class EnvService {

    constructor() {
    }

    public email="";
    public role="user";
    public dailyLimit=0;
}