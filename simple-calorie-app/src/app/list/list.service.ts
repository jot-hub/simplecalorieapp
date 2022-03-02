import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Entry } from '../../../../model/entry';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { EntryDetail } from '../../../../model/entry-detail';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable()
export class ListService {
  entriesUrl = 'api/entries';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ListService');
  }

  /** GET entries from the server */
  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.entriesUrl)
      .pipe(
        catchError(this.handleError('getEntries', []))
      );
  }

  /* GET entries whose name contains search term */
  searchEntries(term: string): Observable<Entry[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Entry[]>(this.entriesUrl, options)
      .pipe(
        catchError(this.handleError<Entry[]>('searchEntries', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new entry to the database */
  addEntry(entry: Entry): Observable<Entry> {
    return this.http.post<Entry>(this.entriesUrl, entry, httpOptions)
      .pipe(
        catchError(this.handleError('addEntry', entry))
      );
  }

  addDetailEntry(dateParameter: string, detail:EntryDetail) {
    let url = `${this.entriesUrl}/${dateParameter}/details`;
    return this.http.post<EntryDetail>(url, detail, httpOptions)
      .pipe(
        catchError(this.handleError('addDetailEntry', detail))
      );
  }

  /** DELETE: delete the entry from the server */
  deleteEntry(id: string): Observable<unknown> {
    const url = `${this.entriesUrl}/${id}`; // DELETE api/entries/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteEntry'))
      );
  }

  /** DELETE: delete the entry from the server */
  deleteDetailEntry(id: string, detaildId: string): Observable<unknown> {
    const url = `${this.entriesUrl}/${id}/details/${detaildId}`; // DELETE api/entries/42/details/43
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteEntry'))
      );
  }

  /** PUT: update the entry on the server. Returns the updated entry upon success. */
  updateEntry(entry: Entry): Observable<Entry> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Entry>(this.entriesUrl, entry, httpOptions)
      .pipe(
        catchError(this.handleError('updateEntry', entry))
      );
  }
}