@foreach ($contents as $content)
    <div class="post" id="content-{{ $content->id }}">
     @include('contents.content_describe')
    </div>
@endforeach