@foreach ($images as $image)
    <li id="image-{{ $image->id }}">
        <div class="tn-top-bar text-muted text-left">

            {{-- rotate image counter-clockwise --}}
            <a href="#" data-image-id="{{ $image->id }}" data-degree="90" title="Rotate 90&deg; counter-clock-wise">
                <i class="fa fa-undo"></i>
            </a>

            {{-- rotate image clockwise --}}
            <a href="#" data-image-id="{{ $image->id }}" data-degree="-90" title="Rotate 90&deg; clock-wise">
                <i class="fa fa-repeat"></i>
            </a>

            <span class="pull-right">
                <a href="#" class="ajax-link delete-link" data-url="/images/{{ $image->id }}" data-method="DELETE" data-onsuccess='remove_tile'>
                    <i class="fa fa-times"></i>
                </a>
            </span>
        </div>
        <img src="{{ $image->url }}" title="{{ $image->title }}" class="image-id-{{ $image->id }}">
    </li>
@endforeach