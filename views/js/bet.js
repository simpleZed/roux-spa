setTimeout(() =>
{
    scope.$number = 4;
    setTimeout(() =>
    {
        scope.$number = 1;
        setTimeout(() =>
        {
            scope.$number = 10;
            setTimeout(() =>
            {
                scope.$number = 0;
                setTimeout(() =>
                {
                    scope.$number = 6;
                }, 1_000);
            }, 1_000);
        }, 1_000);
    }, 1_000);
}, 1_000);