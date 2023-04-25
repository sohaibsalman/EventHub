using Application.Core;
using Application.Interfaces;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Update
    {
        public class Command : IRequest<Result<Unit>>
        {
            public ProfileDto profileDto { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.profileDto.DisplayName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context
                    .Users
                    .SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                _mapper.Map(request.profileDto, user);
                bool result = await _context.SaveChangesAsync() > 0;

                if (result) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Unable to update the profile");
            }
        }
    }
}