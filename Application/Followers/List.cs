using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<Profiles.Profile> result = new();
                switch (request.Predicate)
                {
                    case "followers":
                        result = await _context
                            .UserFollowings
                            .Where(x => x.Target.UserName == request.Username)
                            .Select(x => x.Observer)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new
                            {
                                currentUsername = _userAccessor.GetUsername()
                            })
                            .ToListAsync();
                        break;

                    case "following":
                        result = await _context
                            .UserFollowings
                            .Where(x => x.Observer.UserName == request.Username)
                            .Select(x => x.Target)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new
                            {
                                currentUsername = _userAccessor.GetUsername()
                            })
                            .ToListAsync();
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(result);
            }
        }
    }
}