import { TestBed } from '@angular/core/testing';
import { BoardMembersService } from './boardMember.service';


describe('BoardService', () => {
  let service: BoardMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardMembersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
