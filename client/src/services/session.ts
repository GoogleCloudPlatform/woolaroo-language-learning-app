import { Injectable } from '@angular/core';

interface Session {
  [index: string]: any;
}

@Injectable()
export class SessionService {
  private readonly session: Session;
  public get currentSession(): Session {
    return this.session;
  }

  constructor() {
    this.session = {};
  }
}
